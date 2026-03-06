// Test script to verify user creation
const mongoose = require("mongoose");
const User = require("./models/User");

const testUserCreation = async () => {
  try {
    // Connect to database
    await mongoose.connect("mongodb://127.0.0.1:27017/smart_dryfruit");
    console.log("✅ Connected to MongoDB");

    // Count existing users
    const userCount = await User.countDocuments();
    console.log(`📊 Current users in database: ${userCount}`);

    // List all users
    const users = await User.find().select("-password");
    console.log("\n📋 All users in database:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Count by role
    const adminCount = await User.countDocuments({ role: "admin" });
    const staffCount = await User.countDocuments({ role: "staff" });
    const customerCount = await User.countDocuments({ role: "customer" });

    console.log("\n📊 Users by role:");
    console.log(`   Admin: ${adminCount}`);
    console.log(`   Staff: ${staffCount}`);
    console.log(`   Customer: ${customerCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
};

testUserCreation();
