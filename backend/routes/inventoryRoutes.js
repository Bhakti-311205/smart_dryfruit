const express = require("express");
const Product = require("../models/Product");
const StaffLog = require("../models/StaffLog");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL PRODUCTS WITH INVENTORY DETAILS (ADMIN/STAFF)
router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("supplier", "name email phone")
      .select("-inventoryHistory");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory", error: error.message });
  }
});

// GET INVENTORY HISTORY FOR A PRODUCT (ADMIN/STAFF)
router.get("/history/:productId", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate("inventoryHistory.performedBy", "name role")
      .select("inventoryHistory name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.inventoryHistory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory history", error: error.message });
  }
});

// UPDATE STOCK (STAFF/ADMIN)
router.put("/stock/:id", protect, async (req, res) => {
  try {
    const { quantity, type, reason } = req.body;
    const validTypes = ["Purchase", "Adjustment", "Return"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid inventory type" });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const previousStock = product.stock;
    let newStock;

    if (type === "Purchase" || type === "Return") {
      newStock = previousStock + quantity;
    } else if (type === "Adjustment") {
      newStock = quantity; // Set to specific value
    }

    product.stock = newStock;

    // Add to inventory history
    product.inventoryHistory.push({
      type,
      quantity: type === "Adjustment" ? Math.abs(newStock - previousStock) : quantity,
      previousStock,
      newStock,
      reason: reason || `${type} by ${req.user.role}`,
      performedBy: req.user.id,
      date: new Date()
    });

    await product.save();
    res.json({ message: "Stock updated successfully", product });

    // Log activity
    StaffLog.create({ user: req.user.id, action: "UPDATE_STOCK", details: `${type}: ${product.name} stock ${previousStock} → ${newStock} (${reason || 'N/A'})`, targetModel: "Product", targetId: product._id }).catch(() => { });
  } catch (error) {
    res.status(500).json({ message: "Failed to update stock", error: error.message });
  }
});

// GET LOW STOCK PRODUCTS (ADMIN/STAFF)
router.get("/low-stock", protect, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stock", "$minStockLevel"] }
    })
      .populate("supplier", "name email phone")
      .select("name stock minStockLevel category variety supplier");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock products", error: error.message });
  }
});

// UPDATE MIN/MAX STOCK LEVELS (ADMIN)
router.put("/levels/:id", protect, adminOnly, async (req, res) => {
  try {
    const { minStockLevel, maxStockLevel } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (minStockLevel !== undefined) {
      product.minStockLevel = minStockLevel;
    }
    if (maxStockLevel !== undefined) {
      product.maxStockLevel = maxStockLevel;
    }

    await product.save();
    res.json({ message: "Stock levels updated", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update stock levels", error: error.message });
  }
});

// GET INVENTORY SUMMARY (ADMIN / STAFF)
router.get("/summary", protect, async (req, res) => {
  try {
    // Only allow admin and staff to view inventory summary
    if (req.user.role !== "admin" && req.user.role !== "staff") {
      return res.status(403).json({ message: "Admin or staff only" });
    }

    const totalProducts = await Product.countDocuments();
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } }
    ]);

    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$stock", "$minStockLevel"] }
    });

    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    const categoryWise = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: "$stock" },
          productCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      lowStockCount,
      outOfStockCount,
      categoryWise
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory summary", error: error.message });
  }
});

module.exports = router;
