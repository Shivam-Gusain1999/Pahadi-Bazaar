import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Add new product
 * @route   POST /api/product/add
 * @access  Private (Seller)
 */
export const addProduct = asyncHandler(async (req, res) => {
    let productData;
    try {
        productData = JSON.parse(req.body.productData);
    } catch (error) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid product data format");
    }

    const images = req.files;
    if (!images || images.length === 0) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "At least one product image is required");
    }

    const imagesUrl = await Promise.all(
        images.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
            return result.secure_url;
        })
    );

    const product = await Product.create({ ...productData, image: imagesUrl });

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

    const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });

    if (!product) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Product not found");
    }

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { product }, "Stock updated successfully")
    );
});

/**
 * @desc    Search and filter products
 * @route   GET /api/product/search
 * @access  Public
 * @query   q (search text), category, minPrice, maxPrice, sort, inStock
 */
export const searchProducts = asyncHandler(async (req, res) => {
    const { q, category, minPrice, maxPrice, sort, inStock, page = 1, limit = 12 } = req.query;

    // Build query object
    let query = {};

    // Text search (name and description)
    if (q) {
        query.$or = [
            { name: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
        ];
    }

    // Category filter
    if (category && category !== "all") {
        query.category = { $regex: category, $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
        query.offerPrice = {};
        if (minPrice) query.offerPrice.$gte = Number(minPrice);
        if (maxPrice) query.offerPrice.$lte = Number(maxPrice);
    }

    // In stock filter
    if (inStock === "true") {
        query.inStock = true;
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "price_low") sortOption = { offerPrice: 1 };
    if (sort === "price_high") sortOption = { offerPrice: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };
    if (sort === "name_desc") sortOption = { name: -1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, {
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProducts: total,
                hasMore: skip + products.length < total
            }
        }, "Products fetched successfully")
    );
});

/**
 * @desc    Get all unique categories
 * @route   GET /api/product/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct("category");

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, { categories }, "Categories fetched successfully")
    );
});
