import { z } from "zod";

export const customerSignupValidation = z.object({
    body: z.object({
        fullName: z.string().min(3),
        phoneNumber: z.string().min(10).max(10),
        address: z.string().min(3),
        machineryType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"])
    })
});

export const razorpayOrderValidation = z.object({
    body: z.object({
        customerId: z.string()
    })
});

export const razorpayVerifyValidation = z.object({
    body: z.object({
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
        customerId: z.string()
    })
});
