
import { env } from "../config/env.js";

/**
 * Centralized Express error handler.
 *
 * Express identifies error-handling middleware by its four parameters:
 * (error, req, res, next). Keep all four, even when some are unused.
 *
 * The named export below must match the named import in app.js:
 * import { errorHandler } from "./middleware/errorHandler.js";
 */
export function errorHandler(error, req, res, next) {
  // If headers have already been sent, Express cannot safely replace
  // the response. Pass the error to Express's default error handler.
  if (res.headersSent) {
    return next(error);
  }

  // Only accept valid HTTP error status codes from trusted application
  // errors. Unexpected errors default to HTTP 500.
  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : 500;

  const code = error.code || "INTERNAL_SERVER_ERROR";

  // Hide internal error details in production to avoid leaking
  // implementation information or sensitive server details.
  const message =
    statusCode < 500
      ? error.message
      : env.isProduction
        ? "An unexpected server error occurred."
        : error.message || "An unexpected server error occurred.";

  if (statusCode >= 500) {
    console.error("[api] Internal error:", error.message);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.isProduction ? {} : { stack: error.stack }),
    },
  });
}