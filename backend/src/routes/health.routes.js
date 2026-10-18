
import { Router } from "express";
import { getHealthStatus } from "../services/health.service.js";

const router = Router();

/**
 * Liveness check:
 * Confirms that the Node.js process and Express routes are responding.
 *
 * This does not require MongoDB, so deployment monitoring can still
 * distinguish a running API from a completely unavailable process.
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: "rigcheck-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Detailed health check:
 * Reports database connectivity as well as API status.
 *
 * A disconnected database makes this endpoint return HTTP 503,
 * but the simpler liveness endpoint remains available.
 */
router.get("/ready", (req, res) => {
  const health = getHealthStatus();
  const databaseReady = health.database.status === "connected";

  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    data: health,
  });
});

export default router;
