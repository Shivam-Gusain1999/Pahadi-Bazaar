import mongoose from "mongoose";
import crypto from "crypto";

const bookingSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event reference is required"],
        },
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
        },
        customerEmail: {
            type: String,
            required: [true, "Customer email is required"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        seatsBooked: {
            type: Number,
            required: [true, "Number of seats is required"],
            min: [1, "Must book at least 1 seat"],
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        bookingId: {
            type: String,
            unique: true,
        },
        status: {
            type: String,
            enum: ["confirmed", "cancelled"],
            default: "confirmed",
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique booking ID before saving
bookingSchema.pre("save", function (next) {
    if (!this.bookingId) {
        // Generate a unique booking ID: TKT-XXXXXX
        this.bookingId = "TKT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    }
    next();
});

// Index for faster queries
bookingSchema.index({ event: 1 });
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
