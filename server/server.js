import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";

// Config imports
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

// Route imports
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";

// Controller imports (for Stripe webhook)
import { stripeWebhooks } from "./controllers/orderController.js";

// Middleware imports
import { errorHandler } from "./middlewares/error.middleware.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and cloudinary
await connectDB();
await connectCloudinary();

// Allowed origins for CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://pahadi-bazaar-website.vercel.app",
];

// Stripe webhook route (must be before body parser)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Response middleware (adds res.success, res.error helpers)
app.use(responseMiddleware);

// Health check route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Pahadi Bazaar API is running",
        version: "1.0.0",
    });
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
});