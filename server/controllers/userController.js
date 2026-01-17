import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS, getCookieOptions, JWT_EXPIRY } from "../constants/index.js";

/**
 * @desc    Register new user
 * @route   POST /api/user/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Name, email and password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "User already exists with this email");
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    // Set cookie and send response
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, getCookieOptions(isProduction));

    res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, { email: user.email, name: user.name }, "User registered successfully")
    );
});

/**
 * @desc    Login user
 * @route   POST /api/user/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email and password are required");
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    // Set cookie and send response
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, getCookieOptions(isProduction));

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { email: user.email, name: user.name }, "Login successful")
    );
});

/**
 * @desc    Check if user is authenticated
 * @route   GET /api/user/is-auth
 * @access  Private
 */
export const isAuth = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, "User authenticated")
    );
});

/**
 * @desc    Logout user
 * @route   GET /api/user/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
    });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Logged out successfully")
    );
});
