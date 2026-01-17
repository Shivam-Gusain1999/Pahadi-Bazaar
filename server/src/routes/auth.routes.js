import express from "express";
import { register, login, isAuth, logout, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, googleAuth, googleCallback } from "../controllers/auth.controllers.js";
import { authUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Protected routes
router.get("/is-auth", authUser, isAuth);
router.get("/logout", authUser, logout);
router.get("/profile", authUser, getProfile);
router.put("/profile", authUser, updateProfile);
router.put("/change-password", authUser, changePassword);

export default router;

