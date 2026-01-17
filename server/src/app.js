import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import couponRoutes from "./routes/coupon.routes.js";

// Controller imports (for Stripe webhook)
import { stripeWebhooks } from "./controllers/order.controllers.js";

// Middleware imports
import { errorHandler } from "./middlewares/error.middlewares.js";

const app = express();

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

// Health check route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Pahadi Bazaar API is running",
        version: "1.0.0",
    });
});

// API Routes
app.use("/api/user", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/coupon", couponRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global error handler (must be last)
app.use(errorHandler);

export { app };
