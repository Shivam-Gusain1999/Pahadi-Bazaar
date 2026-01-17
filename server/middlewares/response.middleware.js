/**
 * Response Middleware
 * Attaches helper methods to res object for consistent API responses
 * 
 * Usage in controllers:
 *   res.success(data, "Message", 200)
 *   res.error("Error message", 400)
 */

const responseMiddleware = (req, res, next) => {
    /**
     * Send success response
     * @param {any} data - Response data
     * @param {string} message - Success message
     * @param {number} statusCode - HTTP status code (default: 200)
     */
    res.success = (data = null, message = "Success", statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            statusCode,
            message,
            data,
        });
    };

    /**
     * Send error response
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code (default: 400)
     * @param {Array} errors - Additional error details
     */
    res.error = (message = "Something went wrong", statusCode = 400, errors = []) => {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            errors,
        });
    };

    /**
     * Send created response (201)
     * @param {any} data - Created resource data
     * @param {string} message - Success message
     */
    res.created = (data = null, message = "Created successfully") => {
        return res.success(data, message, 201);
    };

    /**
     * Send not found response (404)
     * @param {string} message - Not found message
     */
    res.notFound = (message = "Resource not found") => {
        return res.error(message, 404);
    };

    /**
     * Send unauthorized response (401)
     * @param {string} message - Unauthorized message
     */
    res.unauthorized = (message = "Unauthorized access") => {
        return res.error(message, 401);
    };

    /**
     * Send forbidden response (403)
     * @param {string} message - Forbidden message
     */
    res.forbidden = (message = "Access forbidden") => {
        return res.error(message, 403);
    };

    next();
};

export { responseMiddleware };
