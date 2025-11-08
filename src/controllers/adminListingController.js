import Listing from "../models/Listing.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";

export const adminGetListings = catchAsync(async (req, res) => {
    const { status, page = 1, limit = 10, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.machineType = type;

    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
        .populate("owner", "fullName phoneNumber")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);

    res.json({ status: true, total, page, pages: Math.ceil(total / limit), listings });
});

export const adminApproveListing = catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");
    res.json({ message: "Listing Approved", listing });
});

export const adminRejectListing = catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");
    res.json({ message: "Listing Rejected", listing });
});

export const adminDeleteListing = catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");
    res.json({ message: "Listing Deleted", listing });
});
