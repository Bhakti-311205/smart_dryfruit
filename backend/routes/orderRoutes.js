const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");
const PDFDocument = require("pdfkit");
const StaffLog = require("../models/StaffLog");

const router = express.Router();

// Lazy-initialize Razorpay instance
let razorpayInstance = null;
function getRazorpay() {
  if (!razorpayInstance) {
    console.log("[Razorpay] Initializing with key:", process.env.RAZORPAY_KEY_ID || "(not set)");
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

// CREATE RAZORPAY ORDER
router.post("/create-razorpay-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("[Razorpay] Create order request, amount:", amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("[Razorpay] Keys not configured in .env");
      return res.status(500).json({ message: "Razorpay keys not configured on server" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("[Razorpay] Order created:", razorpayOrder.id);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order", error: error.message });
  }
});

// VERIFY RAZORPAY PAYMENT & CREATE ORDER
router.post("/verify-razorpay-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount,
      address,
      city,
      pincode,
      phone,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed — invalid signature" });
    }

    // Validate items and update stock
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock} Kg, Requested: ${item.quantity} Kg`,
        });
      }

      const previousStock = product.stock;
      product.stock -= item.quantity;
      product.inventoryHistory.push({
        type: "Sale",
        quantity: item.quantity,
        previousStock: previousStock,
        newStock: product.stock,
        reason: "Order placed (Razorpay)",
        performedBy: req.user.id,
        date: new Date(),
      });
      await product.save();

      orderItems.push({
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        pricePerKg: product.pricePerKg,
        totalPrice: product.pricePerKg * item.quantity,
      });
    }

    // Create order with payment details
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMode: "Razorpay",
      paymentStatus: "Completed",
      orderStatus: "Placed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      address,
      city,
      pincode,
      phone,
    });

    const savedOrder = await order.save();
    await savedOrder.populate("user", "name email");

    res.status(201).json(savedOrder);

    // Log activity
    StaffLog.create({ user: req.user.id, action: "CREATE_ORDER", details: `Razorpay order #${savedOrder._id.toString().slice(-8)} placed - ₹${totalAmount}`, targetModel: "Order", targetId: savedOrder._id }).catch(() => { });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
});

// TEST ENDPOINT - Check database connection
router.get("/test", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    const orderCount = await Order.countDocuments();

    res.json({
      database: states[dbState],
      orderCount: orderCount,
      message: "Database connection test"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PLACE ORDER (CUSTOMER)
router.post("/", protect, async (req, res) => {
  try {
    console.log("Order creation request received");
    console.log("User:", req.user);
    console.log("Request body:", req.body);

    const { items, totalAmount, paymentMethod, paymentStatus, address, city, pincode, phone } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("Validation failed: No items");
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!totalAmount || totalAmount <= 0) {
      console.log("Validation failed: Invalid total amount");
      return res.status(400).json({ message: "Invalid total amount" });
    }

    if (!address || !city || !pincode || !phone) {
      console.log("Validation failed: Missing shipping details");
      return res.status(400).json({ message: "Please provide all shipping details" });
    }

    // Check stock availability and update inventory
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock} Kg, Requested: ${item.quantity} Kg`
        });
      }

      // Update product stock
      const previousStock = product.stock;
      product.stock -= item.quantity;

      // Add to inventory history
      product.inventoryHistory.push({
        type: "Sale",
        quantity: item.quantity,
        previousStock: previousStock,
        newStock: product.stock,
        reason: "Order placed",
        performedBy: req.user.id,
        date: new Date()
      });

      await product.save();

      orderItems.push({
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        pricePerKg: product.pricePerKg,
        totalPrice: product.pricePerKg * item.quantity
      });
    }

    // Create order
    const orderData = {
      user: req.user.id,
      items: orderItems,
      totalAmount: totalAmount,
      paymentStatus: paymentStatus || "Pending",
      paymentMode: paymentMethod || "COD",
      orderStatus: "Placed",
      address: address,
      city: city,
      pincode: pincode,
      phone: phone
    };

    console.log("Creating order object with data:", orderData);
    const order = new Order(orderData);

    // Validate before saving
    const validationError = order.validateSync();
    if (validationError) {
      console.error("Order validation error:", validationError);
      const errors = Object.values(validationError.errors).map(e => e.message);
      return res.status(400).json({
        message: "Order validation failed",
        errors: errors
      });
    }

    console.log("Saving order to database...");
    const savedOrder = await order.save();
    console.log("Order saved with ID:", savedOrder._id);
    console.log("Order details:", JSON.stringify(savedOrder, null, 2));

    // Populate user details for response
    await savedOrder.populate("user", "name email");

    console.log("Order created successfully:", {
      orderId: savedOrder._id,
      userId: savedOrder.user?._id || savedOrder.user,
      totalAmount: savedOrder.totalAmount,
      itemsCount: savedOrder.items.length
    });

    res.status(201).json(savedOrder);

    // Log activity
    StaffLog.create({ user: req.user.id, action: "CREATE_ORDER", details: `COD order #${savedOrder._id.toString().slice(-8)} placed - ₹${savedOrder.totalAmount}`, targetModel: "Order", targetId: savedOrder._id }).catch(() => { });
  } catch (error) {
    console.error("Order creation error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages
      });
    }

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// CUSTOMER ORDER HISTORY
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product_id", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// ADMIN VIEW ALL ORDERS (must come before /:id)
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product_id", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// STAFF VIEW ORDERS (must come before /:id)
router.get("/staff/all", protect, staffOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product_id", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// PDF INVOICE - must come before generic :id route
router.get("/:id/invoice", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role === "customer" && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc
      .fontSize(20)
      .text("NutHub - Invoice", { align: "center" })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Invoice ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
      .moveDown();

    doc.text(`Customer: ${order.user?.name || "N/A"}`);
    doc.text(`Email: ${order.user?.email || "N/A"}`);
    if (order.address) {
      doc.text(`Address: ${order.address}, ${order.city || ""} ${order.pincode || ""}`);
    }
    doc.moveDown();

    doc.text("Items:", { underline: true }).moveDown(0.5);

    order.items.forEach((item) => {
      doc.text(
        `${item.product_name} - ${item.quantity} Kg x Rs.${item.pricePerKg} = Rs.${item.totalPrice.toFixed(
          2
        )}`
      );
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total Amount: Rs.${order.totalAmount.toFixed(2)}`, { align: "right" })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Payment Mode: ${order.paymentMode}`)
      .text(`Payment Status: ${order.paymentStatus}`)
      .moveDown(2);

    doc
      .fontSize(10)
      .text(
        "This is a system-generated invoice for demo purposes only.",
        { align: "center", opacity: 0.7 }
      );

    doc.end();
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Failed to generate invoice", error: error.message });
  }
});

// GET SINGLE ORDER (CUSTOMER/ADMIN/STAFF)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product_id", "name image category variety");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user has access to this order
    if (req.user.role === "customer" && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

// STAFF UPDATE ORDER STATUS
router.put("/status/:id", protect, staffOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });

    // Log activity
    StaffLog.create({ user: req.user.id, action: "UPDATE_ORDER_STATUS", details: `Order #${order._id.toString().slice(-8)} status changed to ${status}`, targetModel: "Order", targetId: order._id }).catch(() => { });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

// ADMIN UPDATE PAYMENT STATUS
router.put("/payment/:id", protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ["Pending", "Completed", "Failed"];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Payment status updated", order });

    // Log activity
    StaffLog.create({ user: req.user.id, action: "UPDATE_PAYMENT_STATUS", details: `Order #${order._id.toString().slice(-8)} payment status changed to ${paymentStatus}`, targetModel: "Order", targetId: order._id }).catch(() => { });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status", error: error.message });
  }
});

module.exports = router;
