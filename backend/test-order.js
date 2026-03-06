// Simple test script to verify order creation
const mongoose = require("mongoose");
const Order = require("./models/Order");
const User = require("./models/User");

const testOrderCreation = async () => {
  try {
    // Connect to database
    await mongoose.connect("mongodb://127.0.0.1:27017/smart_dryfruit");
    console.log("✅ Connected to MongoDB");

    // Get a test user
    const user = await User.findOne();
    if (!user) {
      console.log("❌ No users found. Please create a user first.");
      process.exit(1);
    }
    console.log("✅ Found user:", user.email);

    // Create test order
    const testOrder = new Order({
      user: user._id,
      items: [
        {
          product_id: "507f1f77bcf86cd799439011",
          product_name: "Test Product",
          quantity: 1,
          pricePerKg: 100,
          totalPrice: 100
        }
      ],
      totalAmount: 100,
      paymentStatus: "Pending",
      paymentMode: "COD",
      orderStatus: "Placed",
      address: "Test Address",
      city: "Test City",
      pincode: "123456",
      phone: "1234567890"
    });

    const savedOrder = await testOrder.save();
    console.log("✅ Order created successfully!");
    console.log("Order ID:", savedOrder._id);
    console.log("Order details:", JSON.stringify(savedOrder, null, 2));

    // Verify order exists
    const foundOrder = await Order.findById(savedOrder._id);
    if (foundOrder) {
      console.log("✅ Order verified in database");
    } else {
      console.log("❌ Order not found in database");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
};

testOrderCreation();
