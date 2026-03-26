import type { Product } from "@/types/product";
import { getBaseUrl } from "./client";

const TOKEN_KEY = "access_token";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

interface WishlistCategoryApi {
  id: number;
}

interface WishlistBrandApi {
  id: number;
  name: string;
  slug: string;
}

interface WishlistProductApi {
  id: number;
  title: string;
  slug: string;
  final_price: number;
  base_price: number;
  discount: number;
  discount_type: string | null;
  reviews_count: number;
  is_in_stock: boolean;
  thumbnail: string;
  category?: WishlistCategoryApi | null;
  brand?: WishlistBrandApi | null;
}

interface WishlistApiResponse {
  data: WishlistProductApi[];
  status: number;
  message: string;
}

function mapWishlistProductToProduct(item: WishlistProductApi): Product {
  const discountPercent =
    item.base_price > item.final_price && item.base_price > 0
      ? Math.round(((item.base_price - item.final_price) / item.base_price) * 100)
      : undefined;

  return {
    id: String(item.id),
    name: item.title,
    slug: item.slug,
    image: item.thumbnail,
    price: item.final_price,
    originalPrice:
      item.base_price > item.final_price ? item.base_price : undefined,
    discountPercent,
    badge: discountPercent != null && discountPercent > 0 ? "sale" : undefined,
    rating: undefined,
    reviewCount: item.reviews_count,
    categoryId: item.category?.id ? String(item.category.id) : "",
    brand: item.brand?.name,
    brandId: item.brand?.id ? String(item.brand.id) : undefined,
    brandHref: item.brand?.slug ? `/brand/${item.brand.slug}` : undefined,
    inStock: item.is_in_stock,
  };
}

export async function fetchWishlist(): Promise<Product[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/wishlist`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 404) return [];
    throw new Error(`Wishlist fetch failed: ${res.status}`);
  }

  const json = (await res.json()) as WishlistApiResponse;
  if (json.status !== 200 || !Array.isArray(json.data)) return [];
  return json.data.map(mapWishlistProductToProduct);
}

export async function toggleWishlist(productId: number): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/wishlist/toggle/${productId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data.message as string) || `Wishlist toggle failed: ${res.status}`
    );
  }
}
