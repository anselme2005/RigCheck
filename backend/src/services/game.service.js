
import Game from "../models/Game.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

/**
 * Escape special regular-expression characters before using user input
 * in a MongoDB regex query. This makes search literal rather than allowing
 * visitors to submit arbitrary regular expressions.
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePagination(pageValue, limitValue) {
  const requestedPage = Number.parseInt(pageValue, 10);
  const requestedLimit = Number.parseInt(limitValue, 10);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return { page, limit, skip: (page - 1) * limit };
}

/**
 * Return published catalog entries.
 *
 * Optional query parameters:
 * - search: matches the title or aliases
 * - genre: exact genre filter
 * - page: 1-based page number
 * - limit: results per page, capped at 50
 */
export async function listGames(query = {}) {
  const { page, limit, skip } = normalizePagination(
    query.page,
    query.limit,
  );

  const filter = { catalogStatus: "published" };

  if (typeof query.search === "string" && query.search.trim()) {
    const searchPattern = new RegExp(escapeRegex(query.search.trim()), "i");

    filter.$or = [
      { title: searchPattern },
      { aliases: searchPattern },
    ];
  }

  if (typeof query.genre === "string" && query.genre.trim()) {
    filter.genre = query.genre.trim();
  }

  const [games, total] = await Promise.all([
    Game.find(filter)
      .select(
        "title slug aliases genre releaseYear description coverImageUrl platform dataStatus",
      )
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Game.countDocuments(filter),
  ]);

  return {
    games,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + games.length < total,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Return a single published game, including requirement and source fields.
 * A null return means the requested slug doesn't exist in the public catalog.
 */
export async function getGameBySlug(slug) {
  return Game.findOne({
    slug: slug.toLowerCase(),
    catalogStatus: "published",
  }).lean();
}