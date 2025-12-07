import { z } from "zod";

export const createListingSchema = z.object({
    machineName: z.string().min(1),
    machineType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]),
    condition: z.enum(["Excellent", "Good", "Fair"]),
    price: z.number().min(1),
    location: z.string().min(1),
    description: z.string().optional(),
    images: z.object({
        front: z.string().url(),
        back: z.string().url(),
        left: z.string().url(),
        right: z.string().url(),
    }),
    video: z.string().url().optional(),
    contactNumber: z.string().min(10),
});

export const updateListingSchema = z.object({
    machineName: z.string().min(1).optional(),
    machineType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]).optional(),
    condition: z.enum(["Excellent", "Good", "Fair"]).optional(),
    price: z.number().min(1).optional(),
    location: z.string().min(1).optional(),
    description: z.string().optional(),
    images: z.object({
        front: z.string().url().optional(),
        back: z.string().url().optional(),
        left: z.string().url().optional(),
        right: z.string().url().optional(),
    }).optional(),
    video: z.string().url().optional(),
    contactNumber: z.string().min(10).optional(),
});

export const rejectListingSchema = z.object({
    rejectionReason: z.string().optional(),
});
