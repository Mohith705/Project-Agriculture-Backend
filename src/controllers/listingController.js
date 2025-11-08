import Listing from "../models/Listing.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";

// Create new listing
export const createListing = catchAsync(async (req, res) => {
    const customerId = req.user.id;
    const listing = await Listing.create({ ...req.body, customer: customerId });
    res.status(httpStatus.CREATED).json({
        status: true,
        message: "Listing submitted for admin review",
        listing,
    });
});

// Get all listings (admin)
export const getAllListings = catchAsync(async (req, res) => {
    const listings = await Listing.find().populate("customer", "fullName phoneNumber");
    res.json({ status: true, listings });
});

// Get approved listings (for customers)
export const getApprovedListings = catchAsync(async (req, res) => {
    const listings = await Listing.find({ status: "approved" });
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
    const listing = await Listing.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
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
    const customerId = req.user.id;
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
