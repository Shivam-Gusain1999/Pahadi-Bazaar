import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * @desc    Add new product
 * @route   POST /api/product/add
 * @access  Private (Seller)
 */
export const addProduct = asyncHandler(async (req, res) => {
  // Parse product data from request body
  let productData;
  try {
    productData = JSON.parse(req.body.productData);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid product data format");
  }

  // Get uploaded files from multer
  const images = req.files;
  if (!images || images.length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "At least one product image is required");
  }

  // Upload all images to Cloudinary
  const imagesUrl = await Promise.all(
    images.map(async (item) => {
      const result = await cloudinary.uploader.upload(item.path, {
        resource_type: "image",
      });
      return result.secure_url;
    })
  );

  // Create product in database
  const product = await Product.create({
    ...productData,
    image: imagesUrl,
  });

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, product, "Product added successfully")
  );
});

/**
 * @desc    Get all products
 * @route   GET /api/product/list
 * @access  Public
 */
export const productList = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { products }, "Products fetched successfully")
  );
});

/**
 * @desc    Get single product by ID
 * @route   POST /api/product/id
 * @access  Public
 */
export const productById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { product }, "Product fetched successfully")
  );
});

/**
 * @desc    Update product stock status
 * @route   POST /api/product/stock
 * @access  Private (Seller)
 */
export const changeStock = asyncHandler(async (req, res) => {
  const { id, inStock } = req.body;

  if (!id) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Product ID is required");
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { inStock },
    { new: true }
  );

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { product }, "Stock updated successfully")
  );
});