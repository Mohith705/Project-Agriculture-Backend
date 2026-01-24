import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../src/models/Customer.js";
import { connectDB } from "../src/config/db.js";

// Load environment variables
dotenv.config();

const createTestAccount = async () => {
    try {
        // Connect to database
        await connectDB();

        // Delete all existing customers
        const deleteResult = await Customer.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing customer(s)`);

        // Create test account with payment verified
        const testCustomer = await Customer.create({
            name: "Test User",
            number: "9999999999",
            state: "Telangana",
            district: "Hyderabad",
            mandal: "Serilingampally",
            village: "Madhapur",
            pinCode: "500081",
            password: "1234", // Will be hashed automatically
            securityQuestion: "What is your favorite color?",
            securityAnswer: "blue", // Will be hashed automatically in lowercase
            paymentCompleted: true,
            status: "active",
            paymentDetails: {
                orderId: "test_order_123",
                paymentId: "test_payment_123",
                signature: "test_signature_123",
                paidAt: new Date()
            }
        });

        console.log(`\n✅ Test account created successfully!`);
        console.log(`\n📋 Test Account Details:`);
        console.log(`   Name: ${testCustomer.name}`);
        console.log(`   Phone: ${testCustomer.number}`);
        console.log(`   Password: 1234`);
        console.log(`   Status: ${testCustomer.status}`);
        console.log(`   Payment Completed: ${testCustomer.paymentCompleted}`);
        console.log(`   Security Question: ${testCustomer.securityQuestion}`);
        console.log(`   Security Answer: blue`);
        console.log(`\n🔑 Use these credentials to login:`);
        console.log(`   Phone: 9999999999`);
        console.log(`   Password: 1234`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createTestAccount();
