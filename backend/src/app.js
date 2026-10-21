
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import gameRoutes from "./routes/game.routes.js";

const app = express();

/**
 * Apply security headers before processing requests.
 * Helmet uses sensible defaults; production deployment settings
 * can be tightened as the frontend and hosting arrangement mature.
 */
app.use(helmet());

/**
 * Only permit browser requests from the configured frontend origin.
 * CORS is a browser access policy, not a substitute for authentication
 * or authorization. Those protections will be added to admin routes.
 */
app.use(
  cors({
    origin: env.clientOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Restrict incoming JSON body size to reduce unnecessary memory use.
 * Larger uploads will receive a request-size error rather than being
 * accepted without limit.
 */
app.use(express.json({ limit: "100kb" }));

/**
 * Apply a basic per-IP request limit to the API.
 * This is an initial safeguard; production deployments behind proxies
 * must configure Express proxy trust carefully to avoid incorrect
 * client IP handling.
 */
const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
    },
  },
});

app.use("/api", apiLimiter);

/**
 * Small root response helps developers verify that the API is running
 * without needing to remember the full versioned health endpoint.
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RigCheck API is running.",
    apiBase: `/api/${env.apiVersion}`,
  });
});

/**
 * Keep all public API routes under the configured version prefix.
 * Future feature routes will be mounted here as they are implemented.
 */
app.use(`/api/${env.apiVersion}/health`, healthRoutes);
app.use(`/api/${env.apiVersion}/games`, gameRoutes);

/**
 * Middleware order matters:
 * 1. Registered routes get the first chance to handle a request.
 * 2. Unknown routes become consistent 404 responses.
 * 3. Errors are handled centrally.
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
