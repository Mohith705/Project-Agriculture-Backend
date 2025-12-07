import { z } from "zod";

export const getNotificationsValidation = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        isRead: z.enum(["true", "false"]).optional()
    })
});

export const notificationIdValidation = z.object({
    params: z.object({
        notificationId: z.string().min(1, "Notification ID is required")
    })
});

export const sendNotificationToCustomerValidation = z.object({
    body: z.object({
        customerId: z.string().min(1, "Customer ID is required"),
        title: z.string().min(1, "Title is required"),
        body: z.string().min(1, "Body is required"),
        type: z.enum(["listing", "lead", "payment", "general", "system"]).optional(),
        data: z.object({}).passthrough().optional()
    })
});

export const sendNotificationToAllValidation = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        body: z.string().min(1, "Body is required"),
        type: z.enum(["listing", "lead", "payment", "general", "system"]).optional(),
        data: z.object({}).passthrough().optional()
    })
});
