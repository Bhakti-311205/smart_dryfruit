const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["admin", "staff", "customer"],
    default: "customer",
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  // OTP-based email verification
  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: true // existing users stay valid; new ones will be set to false at registration
  },
  // Wishlist / favourites
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
