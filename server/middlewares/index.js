/**
 * Middlewares Index - Central export for all middlewares
 * Import like: import { authUser, authSeller, errorHandler, responseMiddleware } from '../middlewares/index.js'
 */

export { default as authUser } from './authUser.js';
export { default as authSeller } from './authSeller.js';
export { errorHandler } from './error.middleware.js';
export { responseMiddleware } from './response.middleware.js';
