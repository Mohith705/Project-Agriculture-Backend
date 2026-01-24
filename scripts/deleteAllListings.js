import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "../src/models/Listing.js";
import { connectDB } from "../src/config/db.js";

// Load environment variables
dotenv.config();

const deleteAllListings = async () => {
    try {
        // Connect to database
        await connectDB();

        // Count total listings before deletion
        const totalListings = await Listing.countDocuments();
        console.log(`📊 Total listings before deletion: ${totalListings}`);

        // Delete all listings
        const deleteResult = await Listing.deleteMany({});
        console.log(`\n✅ Successfully deleted ${deleteResult.deletedCount} listing(s)`);

        const totalAfter = await Listing.countDocuments();
        console.log(`📊 Total listings after deletion: ${totalAfter}`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

deleteAllListings();
