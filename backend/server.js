require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

connectDB();

const app = express();

// ─── SECURITY & PERFORMANCE MIDDLEWARE ───
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rate limiting: 100 requests per 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// IMAGE FOLDER
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API ROUTES ───
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/activity-logs", require("./routes/activityLogRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/bulk-orders", require("./routes/bulkOrderRoutes"));

// ─── SERVE FRONTEND IN PRODUCTION ───
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "frontend", "build");
  app.use(express.static(buildPath));

  // Any route that is NOT /api/* should serve the React app
  app.all(/(.*)/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Error handling middleware (must be last)
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
