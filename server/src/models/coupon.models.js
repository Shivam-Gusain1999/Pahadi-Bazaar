import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0
        },
        minimumOrderAmount: {
            type: Number,
            default: 0
        },
        maximumDiscount: {
            type: Number,
            default: null
        },
        usageLimit: {
            type: Number,
            default: null
        },
        usedCount: {
            type: Number,
            default: 0
        },
        validFrom: {
            type: Date,
            default: Date.now
        },
        validUntil: {
            type: Date,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        description: {
            type: String
        },
    },
    { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
