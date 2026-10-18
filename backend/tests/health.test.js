
import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

/**
 * These tests exercise the Express application directly.
 * Supertest creates the HTTP requests without requiring us to start
 * a separate listening server or connect to a real MongoDB instance.
 */
describe("RigCheck health API", () => {
  it("returns a successful response from the root endpoint", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("RigCheck API is running.");
  });

  it("returns API health from the versioned health endpoint", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.service).toBe("rigcheck-api");
    expect(response.body.data.status).toBe("ok");
  });

  it("returns a consistent JSON response for an unknown route", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("reports database readiness without exposing credentials", async () => {
    const response = await request(app).get("/api/v1/health/ready");

    // The database may be disconnected during initial development.
    // Both outcomes are valid; the status must match the reported state.
    if (response.body.data.database.status === "connected") {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    } else {
      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
    }

    expect(response.body.data).not.toHaveProperty("mongodbUri");
    expect(JSON.stringify(response.body)).not.toContain("mongodb+srv://");
  });
});