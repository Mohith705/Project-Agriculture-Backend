import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

export const paymentCheck = (req, res, next) => {
    if (!req.user.paymentCompleted) {
        throw new ApiError(httpStatus.FORBIDDEN, "Payment not completed. Complete payment first.");
    }
    next();
};
