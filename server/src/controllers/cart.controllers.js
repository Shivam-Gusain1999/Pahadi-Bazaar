import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Update user cart
 * @route   POST /api/cart/update
 * @access  Private
 */
export const updateCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { cartItems });

    res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, "Cart updated successfully")
    );
});
