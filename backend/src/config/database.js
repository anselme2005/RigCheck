
import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Establish the MongoDB connection.
 *
 * If no URI is configured, allow the API to run in development mode
 * without database-backed features. Health checks will report that
 * the database is disconnected.
 *
 * In production, a missing URI is a deployment configuration error,
 * so the server must not start in that state.
 */
export async function connectDatabase() {
  if (!env.mongodbUri) {
    if (env.isProduction) {
      throw new Error(
        "MONGODB_URI is required in production."
      );
    }

    console.warn(
      "[database] MONGODB_URI is not configured. Running without MongoDB."
    );

    return false;
  }

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("[database] MongoDB connected successfully.");

    return true;
  } catch (error) {
    /**
     * Do not log the connection string: it may contain database
     * credentials. The underlying error message is sufficient for
     * initial diagnostics in development.
     */
    console.error(
      "[database] MongoDB connection failed:",
      error.message
    );

    throw error;
  }
}

/**
 * Close the database connection cleanly during application shutdown.
 * This prevents open connections from keeping the Node process alive.
 */
export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("[database] MongoDB disconnected.");
  }
}

/**
 * readyState === 1 means Mongoose has an active connection.
 * This is used by health endpoints without exposing credentials.
 */
export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
