import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || "agriculture"
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("DB Error =>", err);
        process.exit(1);
    }
};
