import express from "express";
import { addReview, getProductReviews, getMyReviews, deleteReview, getProductRating } from "../controllers/review.controllers.js";
import { authUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", authUser, addReview);
router.get("/product/:productId", getProductReviews);
router.get("/rating/:productId", getProductRating);
router.get("/my-reviews", authUser, getMyReviews);
router.delete("/:reviewId", authUser, deleteReview);

export default router;
