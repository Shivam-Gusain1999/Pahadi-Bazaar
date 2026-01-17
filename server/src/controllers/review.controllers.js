import Review from "../models/review.models.js";
import Order from "../models/order.models.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Add a review for a product
 * @route   POST /api/review/add
 * @access  Private
 */
export const addReview = asyncHandler(async (req, res) => {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating || !comment) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID, rating, and comment are required");
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Rating must be between 1 and 5");
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "You have already reviewed this product");
    }

    // Check if user has purchased this product (verified purchase)
    const hasPurchased = await Order.findOne({
        userId,
        "items.product": productId,
        isPaid: true
    });

    const review = await Review.create({
        userId,
        productId,
        rating,
        title,
        comment,
        isVerifiedPurchase: !!hasPurchased
    });

    res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, { review }, "Review added successfully")
    );
});

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/review/product/:productId
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ productId })
        .populate("userId", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Review.countDocuments({ productId });

    // Calculate average rating - using try-catch for ObjectId conversion
    let ratingStats = [];
    try {
        const objectId = new mongoose.Types.ObjectId(productId);
        ratingStats = await Review.aggregate([
            { $match: { productId: objectId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                    fiveStar: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    fourStar: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    threeStar: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    twoStar: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                }
            }
        ]);
    } catch (error) {
        // If ObjectId conversion fails, return empty stats
        console.log("ObjectId conversion error:", error.message);
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, {
            reviews,
            stats: ratingStats[0] || { averageRating: 0, totalReviews: 0 },
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalReviews: total
            }
        }, "Reviews fetched successfully")
    );
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/review/my-reviews
 * @access  Private
 */
export const getMyReviews = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const reviews = await Review.find({ userId })
        .populate("productId", "name image offerPrice")
        .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { reviews }, "Your reviews fetched successfully")
    );
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/review/:reviewId
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Review not found or unauthorized");
    }

    await Review.deleteOne({ _id: reviewId });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Review deleted successfully")
    );
});

/**
 * @desc    Get average rating for a product (lightweight)
 * @route   GET /api/review/rating/:productId
 * @access  Public
 */
export const getProductRating = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let stats = [];
    try {
        const objectId = new mongoose.Types.ObjectId(productId);
        stats = await Review.aggregate([
            { $match: { productId: objectId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);
    } catch (error) {
        console.log("ObjectId conversion error:", error.message);
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, {
            averageRating: stats[0]?.averageRating?.toFixed(1) || "0.0",
            totalReviews: stats[0]?.totalReviews || 0
        }, "Rating fetched successfully")
    );
});

