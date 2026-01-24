import { z } from "zod";

export const createListingSchema = z.object({
    machineName: z.string().min(1),
    machineCompany: z.string().min(1),
    machineType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]),
    machineModel: z.string().min(1),
    manufacturingYear: z.number().min(1900).max(new Date().getFullYear()),
    condition: z.enum(["Excellent", "Good", "Fair"]),
    price: z.number().min(1),
    state: z.string().min(1),
    district: z.string().min(1),
    mandal: z.string().min(1),
    village: z.string().min(1),
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
    machineCompany: z.string().min(1).optional(),
    machineType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]).optional(),
    machineModel: z.string().min(1).optional(),
    manufacturingYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
    condition: z.enum(["Excellent", "Good", "Fair"]).optional(),
    price: z.number().min(1).optional(),
    state: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    mandal: z.string().min(1).optional(),
    village: z.string().min(1).optional(),
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
