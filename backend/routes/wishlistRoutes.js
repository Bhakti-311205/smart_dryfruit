const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get current user's wishlist (populated products)
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
});

// Add product to wishlist
router.post("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist) user.wishlist = [];

    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!alreadyInWishlist) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist", error: error.message });
  }
});

// Remove product from wishlist
router.delete("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = (user.wishlist || []).filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist", error: error.message });
  }
});

module.exports = router;

