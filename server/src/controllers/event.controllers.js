import Event from "../models/event.models.js";

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const { category, upcoming } = req.query;

        let filter = {};

        // Filter by category
        if (category && category !== "All") {
            filter.category = category;
        }

        // Filter upcoming events only
        if (upcoming === "true") {
            filter.date = { $gte: new Date() };
        }

        const events = await Event.find(filter)
            .sort({ date: 1 })
            .lean();

        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: error.message,
        });
    }
};

// Get single event by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).lean();

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch event",
            error: error.message,
        });
    }
};

// Create new event (for seeding/admin)
export const createEvent = async (req, res) => {
    try {
        const { name, description, date, venue, totalSeats, price, imageUrl, category } = req.body;

        const event = await Event.create({
            name,
            description,
            date,
            venue,
            totalSeats,
            availableSeats: totalSeats, // Initially all seats available
            price,
            imageUrl,
            category,
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: error.message,
        });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: error.message,
        });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: error.message,
        });
    }
};

// Get event categories
export const getCategories = async (req, res) => {
    try {
        const categories = ["All", "Concert", "Sports", "Theater", "Conference", "Festival", "Other"];

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};
