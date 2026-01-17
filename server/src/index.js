import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import connectCloudinary from "./configs/cloudinary.js";

const port = process.env.PORT || 4000;

// Connect to database and cloudinary, then start server
const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();

        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
