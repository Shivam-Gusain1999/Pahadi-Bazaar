import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Event name is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Event description is required"],
        },
        date: {
            type: Date,
            required: [true, "Event date is required"],
        },
        venue: {
            type: String,
            required: [true, "Venue is required"],
        },
        totalSeats: {
            type: Number,
            required: [true, "Total seats is required"],
            min: [1, "Total seats must be at least 1"],
        },
        availableSeats: {
            type: Number,
            required: [true, "Available seats is required"],
            min: [0, "Available seats cannot be negative"],
        },
        price: {
            type: Number,
            required: [true, "Ticket price is required"],
            min: [0, "Price cannot be negative"],
        },
        imageUrl: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            enum: ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"],
            default: "Other",
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ availableSeats: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
