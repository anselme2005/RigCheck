
import "dotenv/config";

/**
 * Convert a string environment variable into a positive integer.
 * Invalid values fall back to a safe default instead of silently
 * producing NaN or a negative configuration value.
 */
function positiveInteger(value, fallback) {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

const nodeEnv = process.env.NODE_ENV || "development";
const port = positiveInteger(process.env.PORT, 5000);
const rateLimitWindowMs = positiveInteger(
  process.env.RATE_LIMIT_WINDOW_MS,
  15 * 60 * 1000
);
const rateLimitMax = positiveInteger(
  process.env.RATE_LIMIT_MAX,
  100
);

const clientOrigin =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

const apiVersion = process.env.API_VERSION || "v1";

/**
 * Fail fast for unsupported environments or malformed configuration.
 * Catching configuration mistakes at startup is easier to diagnose
 * than discovering them after users begin making requests.
 */
if (!["development", "test", "production"].includes(nodeEnv)) {
  throw new Error(
    "NODE_ENV must be development, test, or production."
  );
}

if (!/^v[1-9]\d*$/.test(apiVersion)) {
  throw new Error(
    "API_VERSION must look like v1, v2, and so on."
  );
}

/**
 * Export one immutable configuration object.
 * The application can import this object instead of reading process.env
 * throughout the codebase.
 */
export const env = Object.freeze({
  nodeEnv,
  port,
  clientOrigin,
  apiVersion,
  mongodbUri: process.env.MONGODB_URI?.trim() || "",
  rateLimitWindowMs,
  rateLimitMax,
  isProduction: nodeEnv === "production",
  isTest: nodeEnv === "test",
});