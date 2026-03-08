/**
 * Centralized query keys for global persisted API cache.
 * Used by GlobalDataHydrator and any consumer that invalidates/refetches.
 */
export const globalQueryKeys = {
  settings: ["settings"] as const,
  categories: ["categories"] as const,
  customerAddresses: ["customer", "addresses"] as const,
  productsHomepage: ["products", "homepage"] as const,
  sliders: ["sliders"] as const,
  /** Search/filter products: [search, category_id, brand_id, min_price, max_price, sort] */
  productsSearch: ["products", "search"] as const,
  /** Products by category (infinite): ["products", "category", categoryId] */
  productsByCategory: (categoryId: string) =>
    ["products", "category", categoryId] as const,
  brands: ["brands"] as const,
} as const;
