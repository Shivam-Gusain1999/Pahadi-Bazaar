import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("wishlist");

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { wishlist: user.wishlist || [] }, "Wishlist fetched successfully")
    );
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/add
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required");
    }

    const user = await User.findById(userId);

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Product already in wishlist");
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Product added to wishlist")
    );
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!productId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required");
    }

    const user = await User.findById(userId);

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Product removed from wishlist")
    );
});

/**
 * @desc    Toggle product in wishlist
 * @route   POST /api/wishlist/toggle
 * @access  Private
 */
export const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required");
    }

    const user = await User.findById(userId);

    const isInWishlist = user.wishlist.some(id => id.toString() === productId);

    if (isInWishlist) {
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
        user.wishlist.push(productId);
    }

    await user.save();

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, {
            isInWishlist: !isInWishlist
        }, isInWishlist ? "Removed from wishlist" : "Added to wishlist")
    );
});
