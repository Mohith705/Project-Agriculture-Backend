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

        paymentCompleted: { type: Boolean, default: false },
        paymentDetails: {
            orderId: String,
            paymentId: String,
            signature: String,
            paidAt: Date
        },

        status: {
            type: String,
            enum: ["active", "suspended", "deleted"],
            default: "active"
        },

        suspended: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },

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
