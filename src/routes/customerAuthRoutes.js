import { Router } from "express";
import validate from "../middlewares/validate.js";
import { customerSignupValidation, razorpayVerifyValidation } from "../validations/customerAuth.validation.js";
import * as custAuth from "../controllers/customerAuthController.js";

const router = Router();

/**
 * @swagger
 * /customer/auth/signup:
 *   post:
 *     summary: Register a new customer and create Razorpay order
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               phoneNumber: { type: string }
 *               address: { type: string }
 *               machineryType: { type: string }
 *     responses:
 *       201:
 *         description: Customer created and order generated
 */
router.post("/customer/auth/signup", validate(customerSignupValidation), custAuth.customerSignup);

/**
 * @swagger
 * /customer/auth/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id: { type: string }
 *               razorpay_payment_id: { type: string }
 *               razorpay_signature: { type: string }
 *               customerId: { type: string }
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post("/customer/auth/verify-payment", validate(razorpayVerifyValidation), custAuth.verifyRazorpayPayment);

export default router;
