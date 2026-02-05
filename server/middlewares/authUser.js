import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Middleware to authenticate regular users
 * Verifies JWT token from cookies and attaches user to request
 */
const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Please login to continue"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token"));
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired, please login again"));
    }
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token"));
  }
};

export default authUser;