import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        machineryType: {
            type: String,
            enum: ["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"],
            required: true
        },
        password: { type: String, required: true, select: false },

        paymentCompleted: { type: Boolean, default: true },
        paymentDetails: {
            orderId: { type: String, default: "123" },
            paymentId: { type: String, default: "12345" },
            signature: { type: String, default: "mohith" },
            paidAt: { type: String, default: "24-05-2025" }
        },
        status: {
            type: String,
            enum: ["active", "suspended","inactive","deleted"],
            default: "active"
        },

    },
    { timestamps: true }
);

customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

customerSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("Customer", customerSchema);
