import Message from "../models/message.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Create contact message
 * @route   POST /api/contact
 * @access  Public
 */
export const createMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Name, email and message are required");
    }

    const newMessage = await Message.create({ name, email, message });

    res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, { message: newMessage }, "Message saved successfully")
    );
});
