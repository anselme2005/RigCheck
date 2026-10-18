
import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

/**
 * Start the service only after required startup checks complete.
 * In development, MongoDB may be omitted temporarily; production
 * requires a valid database connection.
 */
async function startServer() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(
      `[server] RigCheck API listening at http://localhost:${env.port}`
    );
    console.log(
      `[server] Health endpoint: http://localhost:${env.port}/api/${env.apiVersion}/health`
    );
  });

  /**
   * Handle shutdown signals so active requests and database connections
   * have a chance to close cleanly.
   */
  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log(`[server] Received ${signal}; shutting down.`);

    // Stop accepting new connections before closing the database.
    server.close(async (error) => {
      if (error) {
        console.error("[server] HTTP shutdown failed:", error.message);
        process.exitCode = 1;
      }

      try {
        await disconnectDatabase();
      } catch (databaseError) {
        console.error(
          "[server] Database shutdown failed:",
          databaseError.message
        );
        process.exitCode = 1;
      }

      process.exit(process.exitCode || 0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

/**
 * Fail clearly if startup cannot complete. Do not keep a half-configured
 * server running when a production database connection is mandatory.
 */
startServer().catch((error) => {
  console.error("[server] Startup failed:", error.message);
  process.exitCode = 1;
});