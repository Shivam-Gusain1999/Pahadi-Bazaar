import express from "express";
import { createMessage } from "../controllers/contactController.js";

const contactRouter = express.Router();

// Public POST route for Contact Us form
contactRouter.post("/", createMessage);

export default contactRouter;
