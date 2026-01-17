import express from "express";
import { addAddress, getAddress } from "../controllers/address.controllers.js";
import { authUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", authUser, addAddress);
router.get("/get", authUser, getAddress);

export default router;
