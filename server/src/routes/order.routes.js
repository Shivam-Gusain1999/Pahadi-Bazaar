import express from "express";
import { placeOrderCod, placeOrderStripe, getUserOrders, getAllOrders } from "../controllers/order.controllers.js";
import { authUser, authSeller } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/cod", authUser, placeOrderCod);
router.post("/stripe", authUser, placeOrderStripe);
router.get("/user", authUser, getUserOrders);
router.get("/seller", authSeller, getAllOrders);

export default router;
