import { z } from "zod";

export const createListingSchema = z.object({
    machineName: z.string().min(1),
    machineType: z.enum(["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"]),
    condition: z.enum(["Good", "Fair"]),
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
