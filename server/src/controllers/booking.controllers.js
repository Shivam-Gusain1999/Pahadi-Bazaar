import Event from "../models/event.models.js";
import Booking from "../models/booking.models.js";


export const createBooking = async (req, res) => {
    try {
        const { eventId, customerName, customerEmail, seatsBooked } = req.body;


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

       
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                availableSeats: { $gte: seatsBooked }, 
            },
            {
                $inc: { availableSeats: -seatsBooked }, 
            },
            {
                new: true,
            }
        );

    
        if (!updatedEvent) {
           
            const eventExists = await Event.findById(eventId);

            if (!eventExists) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found",
                });
            }

            
            return res.status(400).json({
                success: false,
                message: `Not enough seats available. Only ${eventExists.availableSeats} seat(s) remaining.`,
                availableSeats: eventExists.availableSeats,
            });
        }

        
        const totalAmount = updatedEvent.price * seatsBooked;

      
        const booking = await Booking.create({
            event: eventId,
            customerName,
            customerEmail,
            seatsBooked,
            totalAmount,
        });

      
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


export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        
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


export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

      
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

       
        await Event.findByIdAndUpdate(booking.event, {
            $inc: { availableSeats: booking.seatsBooked },
        });

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
