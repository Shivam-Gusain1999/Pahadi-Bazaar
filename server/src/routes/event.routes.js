import express from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getCategories,
} from "../controllers/event.controllers.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/categories", getCategories);
router.get("/:id", getEventById);

// Admin routes (no auth required per assessment scope)
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
