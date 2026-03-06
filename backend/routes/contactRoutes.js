const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new contact message (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and message" });
    }

    const contactMessage = new ContactMessage({ name, email, message });
    await contactMessage.save();

    res
      .status(201)
      .json({ message: "Message received successfully", contactMessage });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    res
      .status(500)
      .json({ message: "Failed to submit message", error: error.message });
  }
});

// (Optional) Get all messages - admin only
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch contact messages", error: error.message });
  }
});

module.exports = router;

