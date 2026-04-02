import type { CartItem } from "@/store/cart-store";
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

/** Use same-origin proxy to avoid CORS; proxy forwards to backend. */
function getCartBaseUrl(): string {
  if (typeof window === "undefined") return getBaseUrl();
  return "/api";
}

/** Cart product as returned by GET /cart */
export interface CartProductApi {
  id: number;
  title: string;
  slug: string;
  sku: string;
  regular_price: number;
  discounted_price: number;
  is_campaign: boolean;
  campaign: unknown | null;
  thumbnail: string;
}

/** Cart variation as returned by GET /cart */
export interface CartVariationApi {
  id: number;
  type: string;
  value: string;
  image: string;
}

/** Single cart line as returned by GET /cart */
export interface CartLineApi {
  id: number;
  campaign_id: number | null;
  product: CartProductApi;
  variation: CartVariationApi | null;
  quantity: number;
  subtotal: number;
}

export interface CartApiResponse {
  data: CartLineApi[];
  status: number;
  message: string;
}

/** Map cart API product + optional variation to app Product type */
function mapCartProductToProduct(
  product: CartProductApi,
  variation: CartVariationApi | null
): Product {
  const price = product.discounted_price;
  const originalPrice =
    product.regular_price > price ? product.regular_price : undefined;
  const discountPercent =
    originalPrice != null && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;
  const image = variation?.image ?? product.thumbnail;

  return {
    id: String(product.id),
    name: product.title,
    slug: product.slug,
    image,
    price,
    originalPrice,
    discountPercent,
    badge: discountPercent != null && discountPercent > 0 ? "sale" : undefined,
    rating: undefined,
    reviewCount: undefined,
    unit: undefined,
    categoryId: "",
    brand: undefined,
    inStock: true,
  };
}

/** Map a cart line from API to store CartItem */
export function mapCartLineToCartItem(line: CartLineApi): CartItem {
  return {
    lineId: line.id,
    variation: line.variation
      ? {
        id: line.variation.id,
        type: line.variation.type,
        value: line.variation.value,
      }
      : undefined,
    product: mapCartProductToProduct(line.product, line.variation),
    quantity: line.quantity,
  };
}

/** Fetch cart from GET /cart and return items for the store */
export async function fetchCart(): Promise<CartItem[]> {
  const baseUrl = getCartBaseUrl();
  const res = await fetch(`${baseUrl}/cart`, {
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 404) return [];
    throw new Error(`Cart fetch failed: ${res.status}`);
  }

  const json = (await res.json()) as CartApiResponse;
  if (json.status !== 200 || !Array.isArray(json.data)) {
    return [];
  }
  return json.data.map(mapCartLineToCartItem);
}

/**
 * POST /cart/add JSON body (same-origin: `/api/cart/add` → backend `cart/add`).
 *
 * @example
 * ```json
 * {
 *   "product_id": 1,
 *   "product_variation_id": 137,
 *   "campaign_id": 3,
 *   "quantity": 5
 * }
 * ```
 * `product_variation_id` and `campaign_id` are omitted when not applicable.
 */
export interface AddToCartPayload {
  product_id: number;
  product_variation_id?: number;
  campaign_id?: number;
  quantity: number;
}

/** Add item to cart; returns updated cart items. */
export async function addToCart(payload: AddToCartPayload): Promise<CartItem[]> {
  const baseUrl = getCartBaseUrl();
  const body: Record<string, number> = {
    product_id: payload.product_id,
    quantity: payload.quantity,
  };
  if (payload.product_variation_id != null) {
    body.product_variation_id = payload.product_variation_id;
  }
  if (payload.campaign_id != null) {
    body.campaign_id = payload.campaign_id;
  }
  const res = await fetch(`${baseUrl}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data.message as string) || `Cart add failed: ${res.status}`);
  }
  return fetchCart();
}

/** Remove item from cart; returns updated cart items. */
export async function removeFromCart(cartId: number): Promise<CartItem[]> {
  const baseUrl = getCartBaseUrl();
  const res = await fetch(`${baseUrl}/cart/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ cart_id: cartId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data.message as string) || `Cart remove failed: ${res.status}`);
  }
  return fetchCart();
}

/** Update cart line quantity; returns updated cart items. */
export async function updateCartQuantity(
  cartId: number,
  quantity: number
): Promise<CartItem[]> {
  const baseUrl = getCartBaseUrl();
  const res = await fetch(`${baseUrl}/cart/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ cart_id: cartId, quantity }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data.message as string) || `Cart update failed: ${res.status}`);
  }
  return fetchCart();
}
