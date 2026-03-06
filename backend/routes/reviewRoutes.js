const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET REVIEWS FOR A PRODUCT
router.get("/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        // Calculate average rating
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        res.json({
            reviews,
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
});

// CREATE A REVIEW (must be logged in)
router.post("/", protect, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "Product, rating and comment are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const review = new Review({
            user: req.user.id,
            product: productId,
            rating,
            comment
        });

        await review.save();
        await review.populate("user", "name");

        res.status(201).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }
        res.status(500).json({ message: "Failed to create review", error: error.message });
    }
});

module.exports = router;
