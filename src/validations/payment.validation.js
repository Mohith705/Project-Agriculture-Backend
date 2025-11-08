import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
    customerId: z.string()
});

export const verifyPaymentSchema = z.object({
    order_id: z.string(),
    payment_id: z.string(),
    razorpay_signature: z.string()
});
