const express = require("express");
const BulkOrder = require("../models/BulkOrder");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// SUBMIT BULK ORDER INQUIRY (public)
router.post("/", async (req, res) => {
    try {
        const { companyName, contactPerson, email, phone, products, estimatedQuantity, message } = req.body;

        if (!companyName || !contactPerson || !email || !phone || !products || !estimatedQuantity) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const bulkOrder = new BulkOrder({
            companyName,
            contactPerson,
            email,
            phone,
            products,
            estimatedQuantity,
            message: message || ""
        });

        await bulkOrder.save();
        res.status(201).json({ message: "Bulk order inquiry submitted successfully", bulkOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit inquiry", error: error.message });
    }
});

// GET ALL BULK ORDER INQUIRIES (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const orders = await BulkOrder.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bulk orders", error: error.message });
    }
});

// UPDATE BULK ORDER STATUS (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Contacted", "Confirmed", "Rejected"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await BulkOrder.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Bulk order not found" });
        }

        res.json({ message: "Status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
});

module.exports = router;
