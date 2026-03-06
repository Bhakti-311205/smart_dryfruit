const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/smartdryfruit";
        console.log("[DB] Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("[DB] MongoDB connected successfully");
    } catch (error) {
        console.error("[DB] MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
