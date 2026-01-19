import express from "express";
import {
    createBooking,
    getAllBookings,
    getBookingById,
    cancelBooking,
} from "../controllers/booking.controllers.js";

const router = express.Router();

// Create booking
router.post("/", createBooking);

// Get all bookings (optionally filter by email)
router.get("/", getAllBookings);

// Get booking by ID or bookingId
router.get("/:id", getBookingById);

// Cancel booking
router.patch("/:id/cancel", cancelBooking);

export default router;
