import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        number: { type: String, required: true, unique: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        mandal: { type: String, required: true },
        village: { type: String, required: true },
        pinCode: { type: String },
        password: { type: String, required: true, select: false },
        
        securityQuestion: { type: String, required: true },
        securityAnswer: { type: String, required: true, select: false },
        
        profilePicUrl: { type: String, default: "" },

        paymentCompleted: { type: Boolean, default: false },
        paymentDetails: {
            orderId: { type: String },
            paymentId: { type: String },
            signature: { type: String },
            paidAt: { type: String }
        },
        status: {
            type: String,
            enum: ["active", "suspended", "inactive", "deleted"],
            default: "inactive"
        },

    },
    { timestamps: true }
);

customerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    if (this.isModified("securityAnswer")) {
        const salt = await bcrypt.genSalt(10);
        this.securityAnswer = await bcrypt.hash(this.securityAnswer.toLowerCase(), salt);
    }
    
    next();
});

customerSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

customerSchema.methods.compareSecurityAnswer = async function (candidate) {
    return bcrypt.compare(candidate.toLowerCase(), this.securityAnswer);
};

export default mongoose.model("Customer", customerSchema);
