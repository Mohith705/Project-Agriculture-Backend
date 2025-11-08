import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import Admin from "../models/Admin.js";

const signToken = (user) => {
    return jwt.sign(
        { sub: user.id, role: "admin", username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

export const adminSignup = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const checkExisting = await Admin.findOne({ username });
    if (checkExisting) throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists");

    const admin = await Admin.create({ username, password });
    const token = signToken(admin);

    res.status(httpStatus.CREATED).json({
        message: "Admin Created Successfully",
        token,
        admin: { id: admin.id, username: admin.username }
    });
});

export const adminLogin = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");

    const ok = await admin.comparePassword(password);
    if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");

    return res.json({
        token: signToken(admin),
        admin: { id: admin.id, username: admin.username }
    });
});
