const BACKEND_BASE = "https://admin.beautycareskin.com/api/v1";
const DEFAULT_SITE_ORIGIN = "https://beautycare.com.bd";

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

function getBackendOrigin(): string {
  return new URL(BACKEND_BASE).origin
}

function getSiteOrigin(): string {
  const envOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined)

  return (envOrigin ?? DEFAULT_SITE_ORIGIN).replace(/\/$/, "")
}

function normalizeMediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined

  // Keep safe absolute URLs, but avoid mixed-content issues in production.
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const parsed = new URL(url)
    if (parsed.protocol === "http:") parsed.protocol = "https:"
    return parsed.toString()
  }

  // Handle protocol-relative media URLs like //cdn.example.com/image.jpg.
  if (url.startsWith("//")) return `https:${url}`

  const origin = getBackendOrigin()
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`
}

export { getBaseUrl, getSiteOrigin, normalizeMediaUrl };
