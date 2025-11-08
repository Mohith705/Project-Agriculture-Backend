import { z } from "zod";

export const adminSignupValidation = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().min(6)
    })
});

export const adminLoginValidation = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().min(6)
    })
});
