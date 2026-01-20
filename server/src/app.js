import cookieParser from "cookie-parser";


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


export default app;
