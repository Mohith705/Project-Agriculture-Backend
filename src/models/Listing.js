import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        machineName: { type: String, required: true },
        machineType: {
            type: String,
            enum: ["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"],
            required: true,
        },
        condition: {
            type: String,
            enum: ["Excellent", "Good", "Fair"],
            required: true,
        },
        price: { type: Number, required: true },
        location: { type: String, required: true },
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
    },
    { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
