
/**
 * Shared API client for browser-side requests.
 *
 * Keeping the base URL and error handling here means future pages
 * can call the API consistently instead of each building its own
 * fetch logic.
 */
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

/**
 * Make a JSON request and normalize common HTTP failures.
 *
 * Do not put secrets in this client: all VITE_ variables are bundled
 * into public browser code and can be inspected by site visitors.
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

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message ||
        `Request failed with status ${response.status}.`
    );

    error.status = response.status;
    error.code = payload?.error?.code || "REQUEST_FAILED";

    throw error;
  }

  return payload;
}

/**
 * Export feature-specific functions rather than exposing raw URLs
 * throughout the UI. This makes future API changes easier to maintain.
 */
export const api = {
  getHealth() {
    return request("/health");
  },

  getReadiness() {
    return request("/health/ready");
  },
};