import { Router } from "express";
import validate from "../middlewares/validate.js";
import * as custAuth from "../controllers/customerAuthController.js";
import { customerSignupValidation, razorpayVerifyValidation, customerLoginValidation, updateProfileValidation } from "../validations/customerAuth.validation.js";
import { protect, customerOnly } from "../middlewares/auth.js";
import { paymentCheck } from "../middlewares/paymentCheck.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customer Auth
 */

/**
 * @swagger
 * /customer/auth/signup:
 *   post:
 *     summary: Register customer and create Razorpay order
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             fullName: "Mohith Bayya"
 *             phoneNumber: "9876543210"
 *             address: "Hyderabad"
 *             machineryType: "Tractor"
 *             password: "123456"
 *     responses:
 *       201:
 *         description: Razorpay order created
 */
router.post("/customer/auth/signup", validate(customerSignupValidation), custAuth.customerSignup);

/**
 * @swagger
 * /customer/auth/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment after signup
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             razorpay_order_id: "order_LSGG5..."
 *             razorpay_payment_id: "pay_LSGH8..."
 *             razorpay_signature: "snjdn239d9..."
 *             customerId: "67394a8d4e..."
 *     responses:
 *       200:
 *         description: Payment successful & token returned
 */
router.post("/customer/auth/verify-payment", validate(razorpayVerifyValidation), custAuth.verifyRazorpayPayment);

/**
 * @swagger
 * /customer/auth/login:
 *   post:
 *     summary: Login customer and get JWT token
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             phoneNumber: "9876543210"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Customer logged in successfully
 */
router.post("/customer/auth/login", validate(customerLoginValidation), custAuth.customerLogin);

/**
 * @swagger
 * /customer/auth/profile:
 *   get:
 *     summary: Get customer profile
 *     tags: [Customer Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 */
router.get("/customer/auth/profile", protect, customerOnly, paymentCheck, custAuth.getProfile);

/**
 * @swagger
 * /customer/auth/profile:
 *   put:
 *     summary: Update customer profile
 *     tags: [Customer Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             fullName: "John Doe"
 *             phoneNumber: "9876543210"
 *             address: "New Address"
 *             machineryType: "Harvester"
 *             profilePicUrl: "https://example.com/pic.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/customer/auth/profile", protect, customerOnly, paymentCheck, validate(updateProfileValidation), custAuth.updateProfile);

export default router;
