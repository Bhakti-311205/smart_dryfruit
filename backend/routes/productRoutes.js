const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const StaffLog = require("../models/StaffLog");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// IMAGE UPLOAD CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// GET ALL PRODUCTS (CUSTOMER)
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD PRODUCT (ADMIN)
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  const product = new Product({
    ...req.body,
    image: req.file.filename
  });

  await product.save();
  res.json(product);

  // Log activity
  StaffLog.create({ user: req.user.id, action: "CREATE_PRODUCT", details: `Product "${product.name}" added`, targetModel: "Product", targetId: product._id }).catch(() => { });
});

// UPDATE STOCK (STAFF)
router.put("/:id", protect, staffOnly, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Product updated" });
});

module.exports = router;
