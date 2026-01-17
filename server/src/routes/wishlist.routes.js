import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist } from "../controllers/wishlist.controllers.js";
import { authUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/", authUser, getWishlist);
router.post("/add", authUser, addToWishlist);
router.delete("/remove/:productId", authUser, removeFromWishlist);
router.post("/toggle", authUser, toggleWishlist);

export default router;
