import express from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import { adminGetListings, adminApproveListing, adminRejectListing, adminDeleteListing } from "../controllers/adminListingController.js";
import validate from "../middlewares/validate.js";
import { rejectListingSchema } from "../validations/listing.validation.js";

const router = express.Router();

/**
 * @swagger
 * /admin/listings:
 *   get:
 *     summary: Get all listings for admin
 *     tags: [Admin Listings]
 *     responses:
 *       200:
 *         description: List of all listings
 */
router.get("/", protect, adminOnly, adminGetListings);

/**
 * @swagger
 * /admin/listings/approve/{id}:
 *   put:
 *     summary: Approve a listing
 *     tags: [Admin Listings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Listing approved
 */
router.put("/approve/:id", protect, adminOnly, adminApproveListing);

/**
 * @swagger
 * /admin/listings/reject/{id}:
 *   put:
 *     summary: Reject a listing
 *     tags: [Admin Listings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Listing rejected
 */
router.put("/reject/:id", protect, adminOnly, validate(rejectListingSchema), adminRejectListing);

/**
 * @swagger
 * /admin/listings/delete/{id}:
 *   delete:
 *     summary: Delete a listing
 *     tags: [Admin Listings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Listing deleted
 */
router.delete("/delete/:id", protect, adminOnly, adminDeleteListing);

export default router;
