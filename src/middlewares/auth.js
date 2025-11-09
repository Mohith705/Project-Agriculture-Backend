import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // store token data only (no DB fetch here)
        next();
    } catch (err) {
        next(err);
    }
};

// Only Admin allowed
export const adminOnly = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Admin Access Only");
        }

        // validate admin exists
        const admin = await Admin.findById(req.user.sub);
        if (!admin) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Admin Token");

        req.user = admin;
        next();
    } catch (err) {
        next(err);
    }
};

// Only Customer allowed
export const customerOnly = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "customer") {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Customer Access Only");
        }

        // validate customer exists
        const customer = await Customer.findById(req.user.sub);
        if (!customer) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Customer Token");

        req.user = customer;
        next();
    } catch (err) {
        next(err);
    }
};
