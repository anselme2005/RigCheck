
/**
 * Wrap an asynchronous Express handler so rejected promises are
 * forwarded to next(error), rather than becoming unhandled errors.
 *
 * Keeping this wrapper reusable avoids repeating try/catch blocks
 * in every route.
 */
export function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
