import express from "express";
import {
    createListing,
    getAllListings,
    approveListing,
    rejectListing,
    deleteListing,
    getApprovedListings,
    getDashboardStats,
    getMyListings,
} from "../controllers/listingController.js";
import { protect, adminOnly, customerOnly } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /listings/create:
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
 *     responses:
 *       201:
 *         description: Listing submitted for admin review
 */

router.post("/create", protect, createListing);

/**
 * @swagger
 * /listings/approved:
 *   get:
 *     summary: Get all approved listings (customer view)
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: List of approved listings
 */

router.get("/approved", protect, getApprovedListings);

/**
 * @swagger
 * /listings/my-listings:
 *   get:
 *     summary: Get all listings created by the current user
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: List of user's listings
 */

router.get("/my-listings", protect, getMyListings);

/**
 * @swagger
 * /listings/dashboard/stats:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: dashboard stats
 */

router.get("/dashboard/stats", protect, customerOnly, getDashboardStats);

/**
 * @swagger
 * /listings/admin/all:
 *   get:
 *     summary: Get all listings for admin
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: List of all listings for admin
 */

router.get("/admin/all", protect, adminOnly, getAllListings);

/**
 * @swagger
 * /listings/admin/approve/{id}:
 *   put:
 *     summary: Approve listing (admin)
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Listing approved
 */

router.put("/admin/approve/:id", protect, adminOnly, approveListing);

/**
 * @swagger
 * /listings/admin/reject/{id}:
 *   put:
 *     summary: Reject listing (admin)
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Listing rejected
 */

router.put("/admin/reject/:id", protect, adminOnly, rejectListing);

/**
 * @swagger
 * /listings/admin/delete/{id}:
 *   delete:
 *     summary: Delete listing (admin)
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Listing deleted
 */

router.delete("/admin/delete/:id", protect, adminOnly, deleteListing);

export default router;
