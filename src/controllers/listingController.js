import Listing from "../models/Listing.js";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";
import { createNotification } from "../utils/notificationService.js";

// Create new listing
export const createListing = catchAsync(async (req, res) => {
    const customerId = req.user._id; // After customerOnly middleware, req.user is the full customer document
    const listing = await Listing.create({ ...req.body, customer: customerId });
    
    // Send confirmation notification to customer
    const customer = req.user; // Already have the customer document
    if (customer) {
        await createNotification(
            customer._id,
            "Listing Submitted",
            `Your ${listing.machineName} listing is under review. You'll be notified once it's approved.`,
            "listing",
            { listingId: listing._id.toString(), status: "pending_review" }
        );
    }
    
    res.status(httpStatus.CREATED).json({
        status: true,
        message: "Listing submitted for admin review",
        listing,
    });
});

// Update listing (customer)
export const updateListing = catchAsync(async (req, res) => {
    const { id } = req.params;
    const customerId = req.user._id; // After customerOnly middleware, req.user is the full customer document
    
    const listing = await Listing.findOne({ _id: id, customer: customerId });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing not found or not owned by you");
    
    const updateData = { ...req.body, status: "pending_review", rejectionReason: undefined };
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    
    // Send notification to customer
    const customer = await Customer.findById(customerId);
    if (customer) {
        await createNotification(
            customer._id,
            "Listing Updated",
            `Your ${updatedListing.machineName} listing has been updated and is under review again.`,
            "listing",
            { listingId: updatedListing._id.toString(), status: "pending_review" }
        );
    }
    
    res.json({ status: true, message: "Listing updated and submitted for review", listing: updatedListing });
});

// Get all listings (admin)
export const getAllListings = catchAsync(async (req, res) => {
    const listings = await Listing.find().populate({ path: "customer", select: "fullName phoneNumber profilePicUrl address" });
    res.json({ status: true, listings });
});

// Get approved listings (for customers)
export const getApprovedListings = catchAsync(async (req, res) => {
    const listings = await Listing.find({ status: "approved" }).populate({ path: "customer", select: "fullName phoneNumber profilePicUrl address" });
    res.json({ status: true, listings });
});

// Get user's own listings
export const getMyListings = catchAsync(async (req, res) => {
    const customerId = req.user._id; // After customerOnly middleware, req.user is the full customer document
    const listings = await Listing.find({ customer: customerId }).populate({ path: "customer", select: "fullName phoneNumber profilePicUrl address" });
    res.json({ status: true, listings });
});

// Admin approve listing
export const approveListing = catchAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { status: "approved" }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
    res.json({ status: true, message: "Listing approved", listing });
});

// Admin reject listing
export const rejectListing = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const listing = await Listing.findByIdAndUpdate(id, { status: "rejected", rejectionReason }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
    res.json({ status: true, message: "Listing rejected", listing });
});

// Admin delete listing
export const deleteListing = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { status: "deleted" });
    res.json({ status: true, message: "Listing deleted" });
});

// Dashboard counts
export const getDashboardStats = catchAsync(async (req, res) => {
    const customerId = req.user._id; // After customerOnly middleware, req.user is the full customer document
    const [activeListings, activeBuyers, soldThisMonth] = await Promise.all([
        Listing.countDocuments({ customer: customerId, status: "approved" }),
        Listing.countDocuments({ status: "approved" }), // can later filter by interested users
        Listing.countDocuments({
            customer: customerId,
            status: "approved",
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        }),
    ]);

    res.json({
        activeListings,
        activeBuyers,
        soldThisMonth,
    });
});
