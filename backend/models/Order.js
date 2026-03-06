const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: Array,
  totalAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Placed"
  },
  paymentMode: {
    type: String,
    enum: ["COD", "UPI", "CARD", "Razorpay"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending"
  },
  // Razorpay payment details
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  address: String,
  city: String,
  pincode: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
