import express from "express";
import { updateCart } from "../controllers/cart.controllers.js";
import { authUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/update", authUser, updateCart);

export default router;
