const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtpEmail } = require("../utils/emailService");

const router = express.Router();

// Helper to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// REGISTER (PUBLIC - can create admin, staff, or customer based on role)
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received");
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate and normalize role
    const allowedRoles = ["admin", "staff", "customer"];
    const userRole = allowedRoles.includes(role) ? role : "customer";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        // Fully verified user — block re-registration
        console.log("User already exists and is verified:", email);
        return res.status(400).json({ message: "User already exists" });
      }
      // Unverified account — allow re-registration, will be overwritten below
      console.log("Unverified account found, allowing re-registration:", email);
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const userData = {
      name,
      email,
      password: hashed,
      role: userRole,
      otp,
      otpExpiry,
      isVerified: false
    };

    console.log("Creating user with data:", { ...userData, password: "[HIDDEN]", otp: "[HIDDEN]" });

    // Use findOneAndUpdate with upsert to safely overwrite unverified accounts
    // and avoid MongoDB unique-index race conditions from delete+insert
    const savedUser = await User.findOneAndUpdate(
      { email },
      { $set: userData },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log("User saved successfully:", {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role
    });

    // Send OTP email (or log in dev fallback)
    // Run asynchronously without awaiting, so it doesn't block the API response
    // if the SMTP server is slow or timing out (Render blocks port 587 sometimes)
    sendOtpEmail(savedUser.email, otp).catch(emailError => {
      console.error("Failed to send async OTP email:", emailError.message);
    });

    // Don't send password or otp in response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;

    res.status(201).json({
      message: "Registered successfully. Please verify the OTP sent to your email.",
      user: userResponse
    });
  } catch (error) {
    console.error("Registration error:", error);
    // Handle MongoDB duplicate key error gracefully
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found for this user" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// RESEND OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email asynchronously
    sendOtpEmail(user.email, otp).catch(emailError => {
      console.error("Failed to resend async OTP email:", emailError.message);
    });

    return res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email using the OTP sent to you." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey123",
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// TEST EMAIL (Diagnostic)
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    console.log("[Diagnostic] Sending test email to:", email);
    await sendOtpEmail(email, "123456");
    res.json({ message: "Test email sent successfully! Please check your inbox/spam." });
  } catch (error) {
    console.error("[Diagnostic] Test email failed:", error);
    res.status(500).json({ message: "Failed to send test email.", error: error.message });
  }
});

module.exports = router;
