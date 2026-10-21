
import {
  getGameBySlug,
  listGames,
} from "../services/game.service.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * GET /api/v1/games
 */
export const listGamesController = asyncHandler(async (req, res) => {
  const result = await listGames({
    search: req.query.search,
    genre: req.query.genre,
    page: req.query.page,
    limit: req.query.limit,
  });

  res.status(200).json({
    success: true,
    data: result.games,
    pagination: result.pagination,
  });
});

/**
 * GET /api/v1/games/:slug
 */
export const getGameController = asyncHandler(async (req, res) => {
  const game = await getGameBySlug(req.params.slug);

  if (!game) {
    return res.status(404).json({
      success: false,
      error: {
        code: "GAME_NOT_FOUND",
        message: "That game could not be found in the public catalog.",
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: game,
  });
});