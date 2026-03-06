const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    supplyPrice: Number,
    lastSupplyDate: Date
  }],
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Supplier", supplierSchema);
