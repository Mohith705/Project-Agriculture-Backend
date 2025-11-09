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
import Razorpay from "razorpay";
import crypto from "crypto";

const signToken = (user) => {
    return jwt.sign(
        { sub: user.id, role: "customer", fullName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const getRazorpay = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};


// customerSignup (Razorpay order create)
export const customerSignup = catchAsync(async (req, res) => {
    const { fullName, phoneNumber,password, address, machineryType } = req.body;

    const already = await Customer.findOne({ phoneNumber });
    if (already) throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already exists");

    // create a temporary customer doc (not fully activated until payment verifies)
    const tempCustomer = await Customer.create({ fullName,password, phoneNumber, address, machineryType, status: "inactive" });

    // Rs.125 fixed amount only at signup
    const razorpay = getRazorpay();
    let order;
    try {
        order = await razorpay.orders.create({
            amount: 12500, // 125 * 100
            currency: "INR",
            receipt: `signup_${tempCustomer._id}`
        });
    } catch (error) {
        await Customer.findByIdAndDelete(tempCustomer._id);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Razorpay order creation failed: ${error.message || error.toString() || 'Unknown error'}`);
    }

    res.status(201).json({
        status: true,
        message: "Razorpay order created for signup payment",
        orderId: order.id,
        tempCustomerId: tempCustomer._id
    });
});


export const createRazorpayOrder = catchAsync(async (req, res) => {
    const { customerId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
        amount: 12500, // 125 INR
        currency: "INR",
        receipt: `cust-${customerId}`,
    });

    res.json({ orderId: order.id });
});


export const verifyRazorpayPayment = catchAsync(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");

    if (expectedSign !== razorpay_signature) throw new ApiError(httpStatus.UNAUTHORIZED, "Payment verification failed");

    const updated = await Customer.findByIdAndUpdate(
        customerId,
        { paymentCompleted: true, paymentDetails: { razorpay_order_id, razorpay_payment_id } },
        { new: true }
    );

    res.json({
        message: "Payment Success",
        token: signToken(updated),
        customer: updated
    });
});

export const verifySignupPayment = catchAsync(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tempCustomerId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature)
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid signature");

    // Activate customer now
    await Customer.findByIdAndUpdate(tempCustomerId, { status: "active" });

    res.status(200).json({
        status: true,
        message: "Verification success. Account activated!"
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
