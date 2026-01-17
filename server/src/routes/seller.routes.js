import express from "express";
import { sellerLogin, isSellerAuth, sellerLogout } from "../controllers/auth.controllers.js";
import { authSeller } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Seller routes
router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, isSellerAuth);
router.get("/logout", authSeller, sellerLogout);

export default router;
