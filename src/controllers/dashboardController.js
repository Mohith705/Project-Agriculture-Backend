import Listing from "../models/Listing.js";
import Customer from "../models/Customer.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";

export const getDashboardCounts = catchAsync(async (req, res) => {
    const customerId = req.user._id; // After customerOnly middleware, req.user is the full customer document

    const activeListings = await Listing.countDocuments({
        customer: new mongoose.Types.ObjectId(customerId),
        status: "approved"
    });

    const activeBuyers = await Listing.countDocuments({
        status: "approved"
    }); // placeholder: later we can implement buyer-seller flow

    const soldThisMonth = await Listing.countDocuments({
        customer: new mongoose.Types.ObjectId(customerId),
        status: "sold",
        createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lte: new Date()
        }
    });

    res.status(200).json({
        activeListings,
        activeBuyers,
        soldThisMonth
    });
});
