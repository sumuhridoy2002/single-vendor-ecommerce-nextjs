import type { MetadataRoute } from "next"
import { getSiteOrigin } from "@/lib/api/client"
import { fetchAllBlogSlugs } from "@/lib/api/blogs"
import { fetchBrands } from "@/lib/api/brands"
import { fetchCampaigns } from "@/lib/api/campaigns"
import { fetchCategories } from "@/lib/api/categories"
import { fetchPages } from "@/lib/api/pages"
import { fetchAllProductSlugs } from "@/lib/api/products"
import { collectCategoryPaths, mapApiCategoryToTreeNode } from "@/lib/category-utils"

/** Regenerate sitemap periodically; aligns with many catalog API revalidate windows. */
export const revalidate = 3600

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteOrigin()
  const now = new Date()

  const [
    productSlugs,
    blogSlugs,
    categoryPaths,
    brands,
    campaigns,
    cmsPages,
  ] = await Promise.all([
    safe(() => fetchAllProductSlugs(), [] as string[]),
    safe(() => fetchAllBlogSlugs(), [] as string[]),
    safe(async () => {
      const roots = await fetchCategories()
      const tree = roots.map(mapApiCategoryToTreeNode)
      return collectCategoryPaths(tree)
    }, [] as string[]),
    safe(() => fetchBrands(), []),
    safe(() => fetchCampaigns(), []),
    safe(() => fetchPages(), []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/flash-sale`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base}/account/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/account/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/account/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/account/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  const products: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${base}/product/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  const blogs: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blogs/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }))

  const categories: MetadataRoute.Sitemap = categoryPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${base}/brand/${encodeURIComponent(b.slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const campaignRoutes: MetadataRoute.Sitemap = campaigns.map((c) => ({
    url: `${base}/campaign/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }))

  const pageRoutes: MetadataRoute.Sitemap = cmsPages.map((p) => ({
    url: `${base}/page/${encodeURIComponent(p.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }))

  return [
    ...staticRoutes,
    ...categories,
    ...products,
    ...brandRoutes,
    ...campaignRoutes,
    ...blogs,
    ...pageRoutes,
  ]
}
