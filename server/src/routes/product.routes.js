import express from "express";
import { addProduct, productList, productById, changeStock, searchProducts, getCategories } from "../controllers/product.controllers.js";
import { authSeller } from "../middlewares/auth.middlewares.js";
import upload from "../configs/multer.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/categories", getCategories);
router.post("/add", authSeller, upload.array("images"), addProduct);
router.get("/list", productList);
router.post("/id", productById);
router.post("/stock", authSeller, changeStock);

export default router;
