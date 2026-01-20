import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// Route imports
import eventRoutes from "./routes/event.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

// Middleware imports
import { errorHandler } from "./middlewares/error.middlewares.js";

// Seed function
import { seedEvents } from "./utils/seedEvents.js";

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://pahadi-bazaar-website.vercel.app",
            "https://ka-technology-client.vercel.app",
    // Add any other frontend URLs here
];

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
        message: "Ticket Reservation System API is running",
        version: "1.0.0",
        endpoints: {
            events: "/api/events",
            bookings: "/api/bookings",
        },
    });
});

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// Seed events endpoint (call once to populate database)
app.post("/api/seed", async (req, res) => {
    try {
        await seedEvents();
        res.json({
            success: true,
            message: "Database seeded successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to seed database",
            error: error.message,
        });
    }
});

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
