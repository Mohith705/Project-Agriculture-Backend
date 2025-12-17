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
        // Better error message extraction from Zod
        let errorMessage = "Validation Error";

        if (err.errors && err.errors.length > 0) {
            const firstError = err.errors[0];
            if (firstError.message) {
                errorMessage = `${firstError.path.join('.')}: ${firstError.message}`;
            } else if (firstError.code) {
                errorMessage = `${firstError.path.join('.')}: ${firstError.code}`;
            }
        } else if (err.message) {
            errorMessage = err.message;
        }

        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
};

export default validate;
