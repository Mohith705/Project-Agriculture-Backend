import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            default: {}
        },
        type: {
            type: String,
            enum: ["listing", "lead", "payment", "general", "system"],
            default: "general"
        },
        isRead: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ customer: 1, createdAt: -1 });
notificationSchema.index({ customer: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
