import type { ProductCategory } from "@/types/product"

const MOCK_CATEGORIES: ProductCategory[] = [
  { id: "daily-essentials", title: "Daily Essentials", slug: "daily-essentials", viewAllHref: "/category/daily-essentials" },
  { id: "best-seller", title: "Best Seller of the Week", slug: "best-seller", viewAllHref: "/category/best-seller" },
  { id: "new-arrivals", title: "Explore New Arrivals", slug: "new-arrivals", viewAllHref: "/category/new-arrivals" },
  { id: "trending", title: "Trending Products", slug: "trending", viewAllHref: "/category/trending" },
  { id: "popular", title: "Popular Categories", slug: "popular", viewAllHref: "/category/popular" },
  { id: "recommended", title: "Recommended for You", slug: "recommended", viewAllHref: "/category/recommended" },
]

export function useCategory(): ProductCategory[] {
  // TODO: Replace with fetch('/api/categories') when API is ready
  return MOCK_CATEGORIES
}
