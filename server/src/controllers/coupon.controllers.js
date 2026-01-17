import Coupon from "../models/coupon.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Create a new coupon (Seller only)
 * @route   POST /api/coupon/create
 * @access  Private (Seller)
 */
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, minimumOrderAmount, maximumDiscount, usageLimit, validFrom, validUntil, description } = req.body;

    if (!code || !discountType || !discountValue || !validUntil) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Code, discount type, discount value, and valid until are required");
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Coupon code already exists");
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minimumOrderAmount: minimumOrderAmount || 0,
        maximumDiscount,
        usageLimit,
        validFrom: validFrom || Date.now(),
        validUntil,
        description
    });

    res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, { coupon }, "Coupon created successfully")
    );
});

/**
 * @desc    Apply coupon to order
 * @route   POST /api/coupon/apply
 * @access  Private
 */
export const applyCoupon = asyncHandler(async (req, res) => {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Coupon code and order amount are required");
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid coupon code");
    }

    // Check validity period
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Coupon is expired or not yet valid");
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Coupon usage limit exceeded");
    }

    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderAmount) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Minimum order amount is ₹${coupon.minimumOrderAmount}`);
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = Math.floor((orderAmount * coupon.discountValue) / 100);
        // Apply maximum discount cap if set
        if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
        }
    } else {
        discount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    if (discount > orderAmount) {
        discount = orderAmount;
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, {
            couponId: coupon._id,
            code: coupon.code,
            discount,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            finalAmount: orderAmount - discount
        }, "Coupon applied successfully")
    );
});

/**
 * @desc    Get all coupons (Seller only)
 * @route   GET /api/coupon/all
 * @access  Private (Seller)
 */
export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { coupons }, "Coupons fetched successfully")
    );
});

/**
 * @desc    Get active coupons for users
 * @route   GET /api/coupon/active
 * @access  Public
 */
export const getActiveCoupons = asyncHandler(async (req, res) => {
    const now = new Date();

    const coupons = await Coupon.find({
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now },
        $or: [
            { usageLimit: null },
            { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
        ]
    }).select("code discountType discountValue minimumOrderAmount maximumDiscount description validUntil");

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { coupons }, "Active coupons fetched successfully")
    );
});

/**
 * @desc    Delete coupon (Seller only)
 * @route   DELETE /api/coupon/:couponId
 * @access  Private (Seller)
 */
export const deleteCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Coupon not found");
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Coupon deleted successfully")
    );
});

/**
 * @desc    Toggle coupon active status (Seller only)
 * @route   PATCH /api/coupon/toggle/:couponId
 * @access  Private (Seller)
 */
export const toggleCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Coupon not found");
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { coupon }, `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`)
    );
});
