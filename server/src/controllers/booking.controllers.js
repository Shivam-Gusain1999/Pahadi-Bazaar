import Event from "../models/event.models.js";
import Booking from "../models/booking.models.js";

// Book tickets - WITH ATOMIC SEAT RESERVATION (prevents overbooking)
export const createBooking = async (req, res) => {
    try {
        const { eventId, customerName, customerEmail, seatsBooked } = req.body;

        // Validate input
        if (!eventId || !customerName || !customerEmail || !seatsBooked) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: eventId, customerName, customerEmail, seatsBooked",
            });
        }

        if (seatsBooked < 1) {
            return res.status(400).json({
                success: false,
                message: "Must book at least 1 seat",
            });
        }

        // ATOMIC OPERATION: Only update if enough seats available
        // This prevents race conditions and overbooking
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                availableSeats: { $gte: seatsBooked }, // Check if enough seats
            },
            {
                $inc: { availableSeats: -seatsBooked }, // Atomically decrement
            },
            {
                new: true,
            }
        );

        // If no event returned, either not found or not enough seats
        if (!updatedEvent) {
            // Check if event exists
            const eventExists = await Event.findById(eventId);

            if (!eventExists) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found",
                });
            }

            // Event exists but not enough seats
            return res.status(400).json({
                success: false,
                message: `Not enough seats available. Only ${eventExists.availableSeats} seat(s) remaining.`,
                availableSeats: eventExists.availableSeats,
            });
        }

        // Calculate total amount
        const totalAmount = updatedEvent.price * seatsBooked;

        // Create booking record
        const booking = await Booking.create({
            event: eventId,
            customerName,
            customerEmail,
            seatsBooked,
            totalAmount,
        });

        // Populate event details for response
        await booking.populate("event", "name date venue");

        res.status(201).json({
            success: true,
            message: "Booking confirmed successfully!",
            data: {
                booking,
                remainingSeats: updatedEvent.availableSeats,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message,
        });
    }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const { email } = req.query;

        let filter = {};
        if (email) {
            filter.customerEmail = email.toLowerCase();
        }

        const bookings = await Booking.find(filter)
            .populate("event", "name date venue imageUrl")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by bookingId first, then by MongoDB _id
        let booking = await Booking.findOne({ bookingId: id })
            .populate("event")
            .lean();

        if (!booking) {
            booking = await Booking.findById(id)
                .populate("event")
                .lean();
        }

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking",
            error: error.message,
        });
    }
};

// Cancel booking (restore seats)
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find booking
        const booking = await Booking.findOne({ bookingId: id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled",
            });
        }

        // Atomically restore seats
        await Event.findByIdAndUpdate(booking.event, {
            $inc: { availableSeats: booking.seatsBooked },
        });

        // Update booking status
        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully. Seats have been restored.",
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel booking",
            error: error.message,
        });
    }
};
