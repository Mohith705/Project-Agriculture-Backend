// import jwt from "jsonwebtoken";
// import httpStatus from "http-status";
// import ApiError from "../utils/ApiError.js";
// import catchAsync from "../utils/catchAsync.js";
// import Customer from "../models/Customer.js";
// import Razorpay from "razorpay";
// import crypto from "crypto";

// const signToken = (user) => {
//     return jwt.sign(
//         { sub: user.id, role: "customer", fullName: user.fullName },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES_IN }
//     );
// };

// const getRazorpay = () => {
//     return new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });
// };

// // Signup → Create customer + create razorpay order
// export const customerSignup = catchAsync(async (req, res) => {
//     const { fullName, phoneNumber, address, machineryType, password } = req.body;

//     const exists = await Customer.findOne({ phoneNumber });
//     if (exists) throw new ApiError(httpStatus.BAD_REQUEST, "Phone already registered");

//     const tempCust = await Customer.create({ fullName, phoneNumber, address, machineryType, password, paymentCompleted: false });

//     const order = await razorpayInstance.orders.create({
//         amount: 12500,
//         currency: "INR",
//         receipt: `signup_${tempCust._id}`
//     });

//     res.status(201).json({
//         status: true,
//         message: "Customer created. Complete payment to activate.",
//         orderId: order.id,
//         customerId: tempCust._id
//     });
// });

// // verify payment
// export const verifyRazorpayPayment = catchAsync(async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerId } = req.body;

//     const expectedSign = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//         .update(razorpay_order_id + "|" + razorpay_payment_id)
//         .digest("hex");

//     if (expectedSign !== razorpay_signature)
//         throw new ApiError(httpStatus.UNAUTHORIZED, "Payment verification failed");

//     const updated = await Customer.findByIdAndUpdate(
//         customerId,
//         { paymentCompleted: true, paymentDetails: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature, paidAt: new Date() } },
//         { new: true }
//     );

//     res.status(200).json({
//         status: true,
//         message: "Payment verified",
//         token: signToken(updated),
//         customer: updated
//     });
// });


import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import Customer from "../models/Customer.js";

// token create
const signToken = (user) => {
    return jwt.sign(
        { sub: user.id, role: "customer", fullName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Signup → directly create customer + default payment true
export const customerSignup = catchAsync(async (req, res) => {
    const { fullName, phoneNumber, address, machineryType, password } = req.body;

    const exists = await Customer.findOne({ phoneNumber });
    if (exists) throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already exists");

    const customer = await Customer.create({
        fullName,
        phoneNumber,
        address,
        machineryType,
        password,
        paymentCompleted: true,
        paymentDetails: {
            orderId: "TEST_ORDER",
            paymentId: "TEST_PAYMENT",
            signature: "TEST_SIGNATURE",
            paidAt: new Date().toISOString()
        }
    });

    res.status(201).json({
        status: true,
        message: "Customer registered successfully (Test Mode)",
        token: signToken(customer),
        customer
    });
});

// no verification needed now
export const verifyRazorpayPayment = catchAsync(async (req, res) => {
    res.status(200).json({
        status: true,
        message: "Payment already auto-verified in test mode"
    });
});

// Login Customer
export const customerLogin = catchAsync(async (req, res) => {
    const { phoneNumber, password } = req.body;

    const customer = await Customer.findOne({ phoneNumber }).select("+password");
    if (!customer) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");

    const match = await customer.comparePassword(password);
    if (!match) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");

    const token = signToken(customer);

    res.status(200).json({
        status: true,
        message: "Login Success",
        token,
        customer
    });
});
