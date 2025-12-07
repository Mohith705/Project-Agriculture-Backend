import Lead from "../models/Lead.js";
import Listing from "../models/Listing.js";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";
import { createNotification } from "../utils/notificationService.js";

export const createLead = catchAsync(async (req, res) => {
    const { listingId, message, contactPhone } = req.body;

    const listing = await Listing.findById(listingId).populate("customer");
    if (!listing) throw new ApiError(httpStatus.NOT_FOUND, "Listing Not Found");

    const lead = await Lead.create({
        listing: listingId,
        buyer: req.user.sub,
        message,
        contactPhone
    });
    
    // Notify the listing owner about the new inquiry
    const listingOwner = listing.customer;
    if (listingOwner) {
        await createNotification(
            listingOwner._id,
            "New Inquiry Received!",
            `Someone is interested in your ${listing.machineName}. Check your leads now!`,
            "lead",
            { listingId: listing._id.toString(), leadId: lead._id.toString() }
        );
    }

    res.status(201).json({ status: true, lead });
});
