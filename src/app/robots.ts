import type { MetadataRoute } from "next"
import { getSiteOrigin } from "@/lib/api/client"

/**
 * Dynamic robots.txt: sitemap URL follows NEXT_PUBLIC_SITE_URL / Vercel env.
 * Policy URLs under /account/ are explicitly allowed so they stay indexable
 * alongside a broad /account/ disallow for private areas.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin()

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/account/terms",
          "/account/privacy",
          "/account/faq",
          "/account/refund-policy",
        ],
        disallow: [
          "/api/",
          "/payment/",
          "/account/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
