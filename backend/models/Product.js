const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    variety: {
      type: String,
      required: true
    },
    quality: {
      type: String,
      required: true
    },
    pricePerKg: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    minStockLevel: {
      type: Number,
      default: 10
    },
    maxStockLevel: {
      type: Number,
      default: 1000
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier"
    },
    costPrice: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    inventoryHistory: [{
      type: {
        type: String,
        enum: ["Purchase", "Sale", "Adjustment", "Return"],
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      previousStock: Number,
      newStock: Number,
      reason: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Virtual for stock status
productSchema.virtual("stockStatus").get(function() {
  if (this.stock === 0) return "Out of Stock";
  if (this.stock <= this.minStockLevel) return "Low Stock";
  if (this.stock >= this.maxStockLevel) return "Overstocked";
  return "In Stock";
});

module.exports = mongoose.model("Product", productSchema);
