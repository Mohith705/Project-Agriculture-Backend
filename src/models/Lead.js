import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    message: { type: String, default: "" },
    contactPhone: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
