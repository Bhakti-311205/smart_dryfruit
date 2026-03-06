const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const StaffLog = require("../models/StaffLog");
const { protect, staffOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// STAFF DASHBOARD
router.get("/dashboard", protect, staffOnly, async (req, res) => {
  res.json({ message: "Staff Dashboard Accessed" });
});

// UPDATE PRODUCT STOCK
router.put("/update-stock/:id", protect, staffOnly, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { stock: req.body.stock });

  await StaffLog.create({
    staff: req.user.id,
    action: "Updated stock",
    product: req.params.id
  });

  res.json({ message: "Stock updated" });
});

// STAFF VIEW ORDERS
router.get("/orders", protect, staffOnly, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;
