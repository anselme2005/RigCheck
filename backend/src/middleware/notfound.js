
/**
 * Return a consistent JSON response when no registered route matches.
 * This middleware is registered after all application routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No route found for ${req.method} ${req.originalUrl}.`,
    },
  });
}
