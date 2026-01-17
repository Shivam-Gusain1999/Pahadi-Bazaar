import express from "express";
import { createCoupon, applyCoupon, getAllCoupons, getActiveCoupons, deleteCoupon, toggleCoupon } from "../controllers/coupon.controllers.js";
import { authUser, authSeller } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveCoupons);

// User routes
router.post("/apply", authUser, applyCoupon);

// Seller routes
router.post("/create", authSeller, createCoupon);
router.get("/all", authSeller, getAllCoupons);
router.delete("/:couponId", authSeller, deleteCoupon);
router.patch("/toggle/:couponId", authSeller, toggleCoupon);

export default router;
