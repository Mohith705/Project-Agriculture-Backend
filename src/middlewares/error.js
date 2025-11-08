import httpStatus from "http-status";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: false,
        code: statusCode,
        message: err.message || "Internal Server Error"
    });
};

export default errorHandler;
