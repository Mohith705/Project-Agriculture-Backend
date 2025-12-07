import Listing from "../models/Listing.js";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";
import { createNotification } from "../utils/notificationService.js";

export const adminGetListings = catchAsync(async (req, res) => {
    const { status, page = 1, limit = 10, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.machineType = type;

    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
        .populate({ path: "customer", select: "fullName phoneNumber profilePicUrl address" })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);

    res.json({ status: true, total, page, pages: Math.ceil(total / limit), listings });
});

export const adminApproveListing = catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");
    
    // Send notification to customer
    const customer = await Customer.findById(listing.customer);
    if (customer) {
        await createNotification(
            customer._id,
            "Listing Approved!",
            `Your ${listing.machineName} listing has been approved and is now live.`,
            "listing",
            { listingId: listing._id.toString(), status: "approved" }
        );
    }
    
    res.json({ message: "Listing Approved", listing });
});

export const adminRejectListing = catchAsync(async (req, res) => {
    const { rejectionReason } = req.body;
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "rejected", rejectionReason }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");
    
    // Send notification to customer
    const customer = await Customer.findById(listing.customer);
    if (customer) {
        await createNotification(
            customer._id,
            "Listing Rejected",
            `Your ${listing.machineName} listing did not meet our guidelines. ${rejectionReason ? `Reason: ${rejectionReason}` : ''} Please review and resubmit.`,
            "listing",
            { listingId: listing._id.toString(), status: "rejected" }
        );
    }
    
    res.json({ message: "Listing Rejected", listing });
});

export const adminDeleteListing = catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");
    
    // Send notification to customer
    const customer = await Customer.findById(listing.customer);
    if (customer) {
        await createNotification(
            customer._id,
            "Listing Removed",
            `Your ${listing.machineName} listing has been removed by the administrator.`,
            "listing",
            { listingId: listing._id.toString(), status: "deleted" }
        );
    }
    
    res.json({ message: "Listing Deleted", listing });
});
