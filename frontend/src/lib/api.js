
/**
 * Shared API client for browser-side requests.
 *
 * All frontend API calls use this module so error handling and the API
 * base URL stay consistent across the application.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

/**
 * Send a request and return its parsed JSON response.
 * Attach useful status information to errors for page-level handling.
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";

  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok || payload?.success === false) {
    const error = new Error(
      payload?.error?.message ||
        `Request failed with status ${response.status}.`,
    );

    error.status = response.status;
    error.code = payload?.error?.code || "REQUEST_FAILED";

    throw error;
  }

  return payload;
}

export const api = {
  /** Existing backend health check. */
  getHealth() {
    return request("/health");
  },

  /** Existing backend readiness check. */
  getReadiness() {
    return request("/health/ready");
  },

  /**
   * Fetch published games from the database.
   * The backend handles title/alias search, genre filtering and pagination.
   */
  getGames({ search = "", genre = "", page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) params.set("search", search.trim());
    if (genre.trim()) params.set("genre", genre.trim());

    return request(`/games?${params.toString()}`);
  },

  /** Fetch one published game by its URL slug. */
  getGame(slug) {
    return request(`/games/${encodeURIComponent(slug)}`);
  },
};