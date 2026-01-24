import { z } from "zod";

export const customerSignupValidation = z.object({
    body: z.object({
        name: z.string().min(3),
        number: z.string().min(10).max(10),
        state: z.string().min(1),
        district: z.string().min(1),
        mandal: z.string().min(1),
        village: z.string().min(1),
        pinCode: z.string().optional(),
        password: z.string().length(4).regex(/^\d{4}$/, "Password must be exactly 4 digits"),
        securityQuestion: z.string().min(1),
        securityAnswer: z.string().min(1)
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
        number: z.string().min(10).max(10),
        password: z.string()
    })
});

export const updateProfileValidation = z.object({
    body: z.object({
        name: z.string().min(3).optional(),
        number: z.string().min(10).max(10).optional(),
        state: z.string().min(1).optional(),
        district: z.string().min(1).optional(),
        mandal: z.string().min(1).optional(),
        village: z.string().min(1).optional(),
        pinCode: z.string().optional(),
        profilePicUrl: z.string().url().optional()
    })
});

export const getSecurityQuestionValidation = z.object({
    body: z.object({
        number: z.string().min(10).max(10)
    })
});

export const resetPasswordValidation = z.object({
    body: z.object({
        customerId: z.string(),
        securityAnswer: z.string().min(1),
        newPassword: z.string().length(4).regex(/^\d{4}$/, "Password must be exactly 4 digits")
    })
});
