const BACKEND_BASE = "https://admin.beautycareskin.com/api/v1";

/**
 * In the browser, returns same-origin /api/v1 so requests are proxied by Next.js (avoids CORS).
 * On the server, returns the real backend URL for API routes and server components.
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return BACKEND_BASE.replace(/\/$/, "");
}

export { getBaseUrl };
