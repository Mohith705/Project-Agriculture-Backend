import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../src/models/Customer.js";
import Listing from "../src/models/Listing.js";
import { connectDB } from "../src/config/db.js";

// Load environment variables
dotenv.config();

const createTestData = async () => {
    try {
        // Connect to database
        await connectDB();

        // Delete all existing data
        await Customer.deleteMany({});
        await Listing.deleteMany({});
        console.log(`🗑️  Deleted all existing customers and listings`);

        // Create test account with payment verified
        const testCustomer = await Customer.create({
            name: "Test User",
            number: "9999999999",
            state: "Telangana",
            district: "Hyderabad",
            mandal: "Serilingampally",
            village: "Madhapur",
            pinCode: "500081",
            password: "1234",
            securityQuestion: "What is your favorite color?",
            securityAnswer: "blue",
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
        console.log(`   Name: ${testCustomer.name}`);
        console.log(`   Phone: ${testCustomer.number}`);

        // Create test listing
        const testListing = await Listing.create({
            customer: testCustomer._id,
            machineName: "John Deere 5310",
            machineCompany: "John Deere",
            machineType: "Tractor",
            machineModel: "5310",
            manufacturingYear: 2020,
            condition: "Excellent",
            price: 850000,
            state: "Telangana",
            district: "Hyderabad",
            mandal: "Serilingampally",
            village: "Madhapur",
            description: "Well maintained tractor, regularly serviced. Single owner, good condition.",
            images: {
                front: "https://example.com/tractor-front.jpg",
                back: "https://example.com/tractor-back.jpg",
                left: "https://example.com/tractor-left.jpg",
                right: "https://example.com/tractor-right.jpg"
            },
            video: "https://example.com/tractor-video.mp4",
            contactNumber: "9999999999",
            status: "approved"
        });

        console.log(`\n✅ Test listing created successfully!`);
        console.log(`   Machine: ${testListing.machineName}`);
        console.log(`   Company: ${testListing.machineCompany}`);
        console.log(`   Status: ${testListing.status}`);

        console.log(`\n🔑 Login Credentials:`);
        console.log(`   Phone: 9999999999`);
        console.log(`   Password: 1234`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createTestData();
