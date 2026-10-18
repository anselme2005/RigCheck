
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { isDatabaseConnected } from "../config/database.js";

/**
 * Return operational information that is safe to expose publicly.
 *
 * Never include environment variables, connection strings, secrets,
 * or detailed server configuration in a public health response.
 */
export function getHealthStatus() {
  return {
    service: "rigcheck-api",
    status: "ok",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    database: {
      status: isDatabaseConnected()
        ? "connected"
        : "disconnected",
      connectionState: mongoose.connection.readyState,
    },
  };
}
