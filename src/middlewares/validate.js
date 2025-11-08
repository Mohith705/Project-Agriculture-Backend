import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        return next();
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err.errors?.[0]?.message || "Validation Error");
    }
};

export default validate;
