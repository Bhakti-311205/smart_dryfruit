const express = require("express");
const StaffLog = require("../models/StaffLog");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL ACTIVITY LOGS (ADMIN ONLY)
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const actionFilter = req.query.action || null;

        const query = actionFilter ? { action: actionFilter } : {};

        const [logs, total] = await Promise.all([
            StaffLog.find(query)
                .populate("user", "name email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            StaffLog.countDocuments(query)
        ]);

        res.json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activity logs", error: error.message });
    }
});

// CREATE LOG ENTRY (used internally by other routes)
router.post("/", protect, async (req, res) => {
    try {
        const { action, details, targetModel, targetId } = req.body;

        const log = new StaffLog({
            user: req.user.id,
            action,
            details,
            targetModel,
            targetId,
            ipAddress: req.ip || req.connection?.remoteAddress || ""
        });

        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: "Failed to create log", error: error.message });
    }
});

module.exports = router;
