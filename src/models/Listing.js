import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        machineName: { type: String, required: true },
        machineCompany: { type: String, required: true },
        machineType: { type: String, required: true },
        machineModel: { type: String, required: true },
        manufacturingYear: { type: Number, required: true },
        condition: {
            type: String,
            enum: ["Excellent", "Good", "Fair"],
            required: true,
        },
        price: { type: Number, required: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        mandal: { type: String, required: true },
        village: { type: String, required: true },
        description: { type: String },
        images: {
            front: { type: String, required: true },
            back: { type: String, required: true },
            left: { type: String, required: true },
            right: { type: String, required: true },
        },
        video: { type: String },
        contactNumber: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending_review", "approved", "rejected", "deleted"],
            default: "pending_review",
        },
        rejectionReason: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
