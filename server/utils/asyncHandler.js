/**
 * Async Handler Wrapper
 * Eliminates try-catch blocks in controllers
 * Automatically catches errors and passes them to error middleware
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };
