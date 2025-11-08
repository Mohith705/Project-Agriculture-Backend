import express from "express";
import {
    createListing,
    getAllListings,
    approveListing,
    rejectListing,
    deleteListing,
    getApprovedListings,
    getDashboardStats,
} from "../controllers/listingController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /listings/create:
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 */
router.post("/create", protect, createListing);

/**
 * @swagger
 * /listings/approved:
 *   get:
 *     summary: Get all approved listings (customer view)
 *     tags: [Listings]
 */
router.get("/approved", protect, getApprovedListings);

/**
 * @swagger
 * /listings/dashboard/stats:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Listings]
 */
router.get("/dashboard/stats", protect, getDashboardStats);

/**
 * @swagger
 * /listings/admin/all:
 *   get:
 *     summary: Get all listings for admin
 *     tags: [Listings]
 */
router.get("/admin/all", protect, adminOnly, getAllListings);

/**
 * @swagger
 * /listings/admin/approve/{id}:
 *   put:
 *     summary: Approve listing (admin)
 *     tags: [Listings]
 */
router.put("/admin/approve/:id", protect, adminOnly, approveListing);

/**
 * @swagger
 * /listings/admin/reject/{id}:
 *   put:
 *     summary: Reject listing (admin)
 *     tags: [Listings]
 */
router.put("/admin/reject/:id", protect, adminOnly, rejectListing);

/**
 * @swagger
 * /listings/admin/delete/{id}:
 *   delete:
 *     summary: Delete listing (admin)
 *     tags: [Listings]
 */
router.delete("/admin/delete/:id", protect, adminOnly, deleteListing);

export default router;
