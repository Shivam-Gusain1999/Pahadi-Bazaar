import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Middleware to authenticate seller
 * Verifies seller JWT token from cookies
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

export default authSeller;