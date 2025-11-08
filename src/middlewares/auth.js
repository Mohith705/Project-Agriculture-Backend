import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";

export const auth = (role = "customer") => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (role === "admin") {
            const admin = await Admin.findById(decoded.sub);
            if (!admin) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Admin Token");
            req.user = admin;
        } else {
            const customer = await Customer.findById(decoded.sub);
            if (!customer) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Customer Token");
            req.user = customer;
        }

        next();
    } catch (err) {
        next(err);
    }
};

// convenience middlewares
export const protect = auth("customer");
export const adminOnly = auth("admin");
