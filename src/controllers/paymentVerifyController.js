import crypto from "crypto";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const paymentVerify = catchAsync(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (signature !== razorpay_signature) {
        throw new ApiError(400, "Payment Verification Failed");
    }

    // mark customer paid
    await Customer.findByIdAndUpdate(req.user.sub, {
        paymentStatus: "paid",
        paymentDetails: { razorpay_order_id, razorpay_payment_id }
    });

    res.json({ status: true, message: "Payment Verified" });
});
