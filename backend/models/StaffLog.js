const mongoose = require("mongoose");

const staffLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            "LOGIN",
            "LOGOUT",
            "CREATE_ORDER",
            "UPDATE_ORDER_STATUS",
            "UPDATE_PAYMENT_STATUS",
            "CREATE_PRODUCT",
            "UPDATE_PRODUCT",
            "DELETE_PRODUCT",
            "UPDATE_STOCK",
            "CREATE_SUPPLIER",
            "UPDATE_SUPPLIER",
            "DELETE_SUPPLIER",
            "CREATE_USER",
            "UPDATE_USER",
            "DELETE_USER",
            "BULK_ORDER_INQUIRY",
            "OTHER"
        ]
    },
    details: {
        type: String,
        default: ""
    },
    targetModel: {
        type: String,
        enum: ["Order", "Product", "User", "Supplier", "BulkOrder", "Other", null],
        default: null
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    ipAddress: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
staffLogSchema.index({ createdAt: -1 });
staffLogSchema.index({ user: 1 });
staffLogSchema.index({ action: 1 });

module.exports = mongoose.model("StaffLog", staffLogSchema);
