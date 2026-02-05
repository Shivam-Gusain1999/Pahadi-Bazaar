import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS, getCookieOptions, JWT_EXPIRY } from "../constants/index.js";

/**
 * @desc    Seller login
 * @route   POST /api/seller/login
 * @access  Public
 */
export const sellerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate credentials against environment variables
    if (password !== process.env.SELLER_PASSWORD || email !== process.env.SELLER_EMAIL) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    // Set cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("sellerToken", token, getCookieOptions(isProduction));

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Seller login successful")
    );
});

/**
 * @desc    Check if seller is authenticated
 * @route   GET /api/seller/is-auth
 * @access  Private (Seller)
 */
export const isSellerAuth = asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Seller authenticated")
    );
});

/**
 * @desc    Seller logout
 * @route   GET /api/seller/logout
 * @access  Private (Seller)
 */
export const sellerLogout = asyncHandler(async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("sellerToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
    });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Seller logged out successfully")
    );
});
