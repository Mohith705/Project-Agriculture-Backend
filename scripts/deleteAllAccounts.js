import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../src/models/Customer.js";
import { connectDB } from "../src/config/db.js";

// Load environment variables
dotenv.config();

const deleteAllAccounts = async () => {
    try {
        // Connect to database
        await connectDB();

        // Count total customers before deletion
        const totalCustomers = await Customer.countDocuments();
        console.log(`📊 Total customers before deletion: ${totalCustomers}`);

        // Delete all customers
        const deleteResult = await Customer.deleteMany({});
        console.log(`\n✅ Successfully deleted ${deleteResult.deletedCount} customer account(s)`);

        const totalAfter = await Customer.countDocuments();
        console.log(`📊 Total customers after deletion: ${totalAfter}`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

deleteAllAccounts();
