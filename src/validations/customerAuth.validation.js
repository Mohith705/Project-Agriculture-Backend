import { z } from "zod";

export const customerSignupValidation = z.object({
    body: z.object({
        fullName: z.string().min(3),
        phoneNumber: z.string().min(10).max(10),
        address: z.string().min(3),
        machineryType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]),
        password: z.string().length(4).regex(/^\d{4}$/, "Password must be exactly 4 digits")
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
        password: z.string()
    })
});

export const updateProfileValidation = z.object({
    body: z.object({
        fullName: z.string().min(3).optional(),
        phoneNumber: z.string().min(10).max(10).optional(),
        address: z.string().min(3).optional(),
        machineryType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]).optional(),
        profilePicUrl: z.string().url().optional()
    })
});
