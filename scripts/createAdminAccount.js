import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../src/models/Admin.js";
import { connectDB } from "../src/config/db.js";

// Load environment variables
dotenv.config();

const createAdminAccount = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: "admin" });
        
        if (existingAdmin) {
            console.log(`\n⚠️  Admin account already exists!`);
            console.log(`   Username: admin`);
            console.log(`\n💡 If you want to reset the password, delete the admin first.`);
            process.exit(0);
        }

        // Create admin account
        const admin = await Admin.create({
            username: "admin",
            password: "admin123" // Will be hashed automatically
        });

        console.log(`\n✅ Admin account created successfully!`);
        console.log(`\n📋 Admin Account Details:`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Password: admin123`);
        console.log(`\n🔑 Use these credentials to login:`);
        console.log(`   Username: admin`);
        console.log(`   Password: admin123`);
        console.log(`\n⚠️  Remember to change the password after first login!`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createAdminAccount();
