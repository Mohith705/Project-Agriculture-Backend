import { z } from "zod";

export const customerSignupValidation = z.object({
    body: z.object({
        fullName: z.string().min(3),
        phoneNumber: z.string().min(10).max(10),
        address: z.string().min(3),
        machineryType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]),
        password: z.string().min(6)
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

export const customerLoginValidation = z.object({
    body: z.object({
        phoneNumber: z.string().min(10).max(10),
        password: z.string().min(3)
    })
});
