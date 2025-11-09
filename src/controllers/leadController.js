import Lead from "../models/Lead.js";
import Listing from "../models/Listing.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";

export const createLead = catchAsync(async (req, res) => {
    const { listingId, message, contactPhone } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");

    const lead = await Lead.create({
        listing: listingId,
        buyer: req.user.sub,
        message,
        contactPhone
    });

    res.status(201).json({ status: true, lead });
});
