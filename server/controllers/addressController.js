import Address from "../models/Address.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * @desc    Add new address
 * @route   POST /api/address/add
 * @access  Private
 */
export const addAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;

  if (!address) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Address details are required");
  }

  const newAddress = await Address.create({ ...address, userId });

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, { address: newAddress }, "Address added successfully")
  );
});

/**
 * @desc    Get all addresses for user
 * @route   GET /api/address/get
 * @access  Private
 */
export const getAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addresses = await Address.find({ userId });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { addresses }, "Addresses fetched successfully")
  );
});
