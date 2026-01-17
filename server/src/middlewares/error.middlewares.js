import { ApiError } from "../utils/apiError.js";

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    // If error is already an ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    }

    // Handle Mongoose CastError
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        return res.status(400).json({ success: false, message });
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        return res.status(409).json({ success: false, message });
    }

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: "Validation Error", errors });
    }

    // Handle JWT Errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired" });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export { errorHandler };
