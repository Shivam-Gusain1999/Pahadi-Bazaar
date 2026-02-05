import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ Database Connection Error:", err.message);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/pahadibazaar`);
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
