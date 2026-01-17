import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * Middleware to authenticate regular users
 */
const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Please login to continue"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token"));
        }

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired, please login again"));
        }
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token"));
    }
};

/**
 * Middleware to authenticate seller
 */
const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Seller authentication required"));
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

        if (decoded.email !== process.env.SELLER_EMAIL) {
            return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Not authorized as seller"));
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired, please login again"));
        }
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid seller token"));
    }
};

export { authUser, authSeller };
