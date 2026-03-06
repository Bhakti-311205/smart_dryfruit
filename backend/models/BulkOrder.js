const mongoose = require("mongoose");

const bulkOrderSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    products: {
        type: String,
        required: true
    },
    estimatedQuantity: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Pending", "Contacted", "Confirmed", "Rejected"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BulkOrder", bulkOrderSchema);
