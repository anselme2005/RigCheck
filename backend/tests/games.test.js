
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

// Mock the service so these tests focus on HTTP routing and responses.
vi.mock("../src/services/game.service.js", () => ({
  listGames: vi.fn(),
  getGameBySlug: vi.fn(),
}));

import app from "../src/app.js";
import {
  getGameBySlug,
  listGames,
} from "../src/services/game.service.js";

const sampleGame = {
  title: "Minecraft",
  slug: "minecraft",
  aliases: ["Minecraft Java Edition"],
  genre: "Sandbox",
  releaseYear: 2011,
  description: "A sandbox game.",
  platform: "PC",
  dataStatus: "preview",
  minimumRequirements: {},
  recommendedRequirements: {},
};

describe("Game catalog API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a paginated list of games", async () => {
    listGames.mockResolvedValue({
      games: [sampleGame],
      pagination: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const response = await request(app)
      .get("/api/v1/games")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("minecraft");
    expect(response.body.pagination.total).toBe(1);
  });

  it("passes search and pagination filters to the service", async () => {
    listGames.mockResolvedValue({
      games: [],
      pagination: {
        page: 2,
        limit: 5,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });

    await request(app)
      .get("/api/v1/games?search=witcher&page=2&limit=5")
      .expect(200);

    expect(listGames).toHaveBeenCalledWith({
      search: "witcher",
      genre: undefined,
      page: "2",
      limit: "5",
    });
  });

  it("returns one game by slug", async () => {
    getGameBySlug.mockResolvedValue(sampleGame);

    const response = await request(app)
      .get("/api/v1/games/minecraft")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe("Minecraft");
    expect(getGameBySlug).toHaveBeenCalledWith("minecraft");
  });

  it("returns a consistent 404 when a game is missing", async () => {
    getGameBySlug.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/v1/games/game-that-does-not-exist")
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("GAME_NOT_FOUND");
  });

  it("forwards service errors to the error handler", async () => {
    listGames.mockRejectedValue(new Error("Database unavailable"));

    await request(app)
      .get("/api/v1/games")
      .expect(500);
  });
});