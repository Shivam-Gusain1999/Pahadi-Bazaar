import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS, getCookieOptions, JWT_EXPIRY } from "../constants.js";

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NODE_ENV === 'production' ? process.env.BACKEND_URL : 'http://localhost:4000'}/api/user/google/callback`
);

/**
 * @desc    Register new user
 * @route   POST /api/user/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Name, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

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

    if (!email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

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

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user, "User authenticated"));
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

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Logged out successfully"));
});

/**
 * @desc    Seller login
 * @route   POST /api/seller/login
 * @access  Public
 */
export const sellerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (password !== process.env.SELLER_PASSWORD || email !== process.env.SELLER_EMAIL) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("sellerToken", token, getCookieOptions(isProduction));

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Seller login successful"));
});

/**
 * @desc    Check if seller is authenticated
 * @route   GET /api/seller/is-auth
 * @access  Private (Seller)
 */
export const isSellerAuth = asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Seller authenticated"));
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

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Seller logged out successfully"));
});

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId)
        .select("-password -resetPasswordToken -resetPasswordExpiry")
        .populate("wishlist");

    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { user }, "Profile fetched successfully")
    );
});

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, phone, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
        .select("-password -resetPasswordToken -resetPasswordExpiry");

    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { user }, "Profile updated successfully")
    );
});

/**
 * @desc    Change user password
 * @route   PUT /api/user/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "New password must be at least 6 characters");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Current password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Password changed successfully")
    );
});

/**
 * @desc    Forgot password - send reset token
 * @route   POST /api/user/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        // Don't reveal if user exists or not for security
        res.status(HTTP_STATUS.OK).json(
            new ApiResponse(HTTP_STATUS.OK, null, "If email exists, reset link will be sent")
        );
        return;
    }

    // Generate reset token
    const crypto = await import("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // TODO: Send email with reset link
    // For now, just return success (email integration needed)
    // Reset URL would be: ${frontendUrl}/reset-password/${resetToken}

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, {
            message: "Reset token generated",
            // In production, don't send token - send via email
            resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
        }, "If email exists, reset link will be sent")
    );
});

/**
 * @desc    Reset password with token
 * @route   POST /api/user/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "New password is required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Password must be at least 6 characters");
    }

    const crypto = await import("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid or expired reset token");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Password reset successfully")
    );
});

/**
 * @desc    Initiate Google OAuth login
 * @route   GET /api/user/google
 * @access  Public
 */
export const googleAuth = asyncHandler(async (req, res) => {
    const authorizeUrl = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent'
    });

    res.redirect(authorizeUrl);
});

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/user/google/callback
 * @access  Public
 */
export const googleCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=no_code`);
    }

    try {
        // Exchange authorization code for tokens
        const { tokens } = await googleClient.getToken(code);
        googleClient.setCredentials(tokens);

        // Get user info from Google
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({
            $or: [{ googleId }, { email }]
        });

        if (user) {
            // User exists - update googleId if not set (user registered with email first)
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                if (picture && !user.avatar) {
                    user.avatar = picture;
                }
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                avatar: picture || '',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

        // Set cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, getCookieOptions(isProduction));

        // Redirect to frontend
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    } catch (error) {
        console.error("Google OAuth error:", error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=auth_failed`);
    }
});
