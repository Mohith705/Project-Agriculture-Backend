import { z } from "zod";

export const adminSignupValidation = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().length(4).regex(/^\d{4}$/, "Password must be exactly 4 digits")
    })
});

export const adminLoginValidation = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string()
    })
});
