const express = require("express");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const StaffLog = require("../models/StaffLog");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL SUPPLIERS (ADMIN)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate("products.product", "name category");
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suppliers", error: error.message });
  }
});

// GET SINGLE SUPPLIER (ADMIN)
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate("products.product", "name category variety pricePerKg");

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch supplier", error: error.message });
  }
});

// CREATE SUPPLIER (ADMIN)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode, gstNumber } = req.body;

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if supplier already exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({ message: "Supplier with this email already exists" });
    }

    const supplier = new Supplier({
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      gstNumber
    });

    await supplier.save();
    res.status(201).json(supplier);

    // Log activity
    StaffLog.create({ user: req.user.id, action: "CREATE_SUPPLIER", details: `Supplier "${supplier.name}" created`, targetModel: "Supplier", targetId: supplier._id }).catch(() => { });
  } catch (error) {
    res.status(500).json({ message: "Failed to create supplier", error: error.message });
  }
});

// UPDATE SUPPLIER (ADMIN)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);

    // Log activity
    StaffLog.create({ user: req.user.id, action: "UPDATE_SUPPLIER", details: `Supplier "${supplier.name}" updated`, targetModel: "Supplier", targetId: supplier._id }).catch(() => { });
  } catch (error) {
    res.status(500).json({ message: "Failed to update supplier", error: error.message });
  }
});

// DELETE SUPPLIER (ADMIN)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Remove supplier reference from products
    await Product.updateMany(
      { supplier: req.params.id },
      { $unset: { supplier: "" } }
    );

    res.json({ message: "Supplier deleted successfully" });

    // Log activity
    StaffLog.create({ user: req.user.id, action: "DELETE_SUPPLIER", details: `Supplier "${supplier.name}" deleted`, targetModel: "Supplier", targetId: supplier._id }).catch(() => { });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete supplier", error: error.message });
  }
});

// ADD PRODUCT TO SUPPLIER (ADMIN)
router.post("/:id/products", protect, adminOnly, async (req, res) => {
  try {
    const { productId, supplyPrice } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product already linked
    const existingProduct = supplier.products.find(
      (p) => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.supplyPrice = supplyPrice || existingProduct.supplyPrice;
      existingProduct.lastSupplyDate = new Date();
    } else {
      supplier.products.push({
        product: productId,
        supplyPrice: supplyPrice || product.costPrice,
        lastSupplyDate: new Date()
      });
    }

    // Update product supplier reference
    product.supplier = supplier._id;
    if (supplyPrice) {
      product.costPrice = supplyPrice;
    }
    await product.save();

    await supplier.save();
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to supplier", error: error.message });
  }
});

module.exports = router;
