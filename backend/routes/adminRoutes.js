const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const StaffLog = require("../models/StaffLog");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ADMIN DASHBOARD
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    res.json({ users, products, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
});

// ORDER ANALYTICS
router.get("/analytics", protect, adminOnly, async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days + 1);

    // Daily orders & revenue
    const daily = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sinceDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Status distribution
    const byStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment mode distribution
    const byPaymentMode = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMode",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Overall totals
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totals = totalStats[0] || { totalOrders: 0, totalRevenue: 0 };

    res.json({
      daily,
      byStatus,
      byPaymentMode,
      totals
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
});

// CREATE USER (ADMIN ONLY - Can create staff/admin)
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    console.log("Admin creating user");
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate role
    const validRoles = ["admin", "staff", "customer"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be admin, staff, or customer" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashed,
      role: role || "customer"
    };

    console.log("Creating user:", { ...userData, password: "[HIDDEN]" });
    const user = new User(userData);

    // Validate before saving
    const validationError = user.validateSync();
    if (validationError) {
      console.error("User validation error:", validationError);
      const errors = Object.values(validationError.errors).map(e => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: errors
      });
    }

    const savedUser = await user.save();
    console.log("User created successfully:", {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role
    });

    // Don't send password in response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);

    // Log activity
    StaffLog.create({ user: req.user.id, action: "CREATE_USER", details: `User "${savedUser.name}" created with role ${savedUser.role}`, targetModel: "User", targetId: savedUser._id }).catch(() => { });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
});

// GET ALL USERS (ADMIN)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

module.exports = router;
