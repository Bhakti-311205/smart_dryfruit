const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

connectDB();

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingAdmin = await User.findOne({ email: "admin@dryfruit.com" });
    const existingStaff = await User.findOne({ email: "staff@dryfruit.com" });

    if (existingAdmin && existingStaff) {
      console.log("✅ Users already exist");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create Admin
    if (!existingAdmin) {
      const admin = new User({
        name: "Admin User",
        email: "admin@dryfruit.com",
        password: hashedPassword,
        role: "admin"
      });
      await admin.save();
      console.log("✅ Admin user created:");
      console.log("   Email: admin@dryfruit.com");
      console.log("   Password: admin123");
    }

    // Create Staff
    if (!existingStaff) {
      const staff = new User({
        name: "Staff User",
        email: "staff@dryfruit.com",
        password: hashedPassword,
        role: "staff"
      });
      await staff.save();
      console.log("✅ Staff user created:");
      console.log("   Email: staff@dryfruit.com");
      console.log("   Password: admin123");
    }

    // Create Test Customer
    const existingCustomer = await User.findOne({ email: "customer@test.com" });
    if (!existingCustomer) {
      const customer = new User({
        name: "Test Customer",
        email: "customer@test.com",
        password: hashedPassword,
        role: "customer"
      });
      await customer.save();
      console.log("✅ Test customer created:");
      console.log("   Email: customer@test.com");
      console.log("   Password: admin123");
    }

    console.log("\n✅ All users created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating users:", error);
    process.exit(1);
  }
};

seedUsers();
