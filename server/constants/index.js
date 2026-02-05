/**
 * Application Constants
 * Centralized location for all constant values
 */

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Order Status
export const ORDER_STATUS = {
    PLACED: "Order Placed",
    CONFIRMED: "Order Confirmed",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

// Payment Types
export const PAYMENT_TYPES = {
    COD: "COD",
    ONLINE: "Online",
};

// Cookie Options
export const getCookieOptions = (isProduction) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// JWT Expiry
export const JWT_EXPIRY = "7d";

// Tax Rate
export const TAX_RATE = 0.02; // 2%
