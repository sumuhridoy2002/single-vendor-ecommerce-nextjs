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

/** Checkout summary amounts */
export interface CheckoutAmounts {
  subtotal: number;
  shipping_charge: number;
  payable_total: number;
}

/** Checkout shipping address as returned by GET /checkout/summary */
export interface CheckoutShippingAddress {
  id: number;
  receiver_name: string;
  receiver_phone: string;
  address_line: string;
  city: string;
}

/** Product shape inside checkout cart item */
export interface CheckoutProductApi {
  id: number;
  slug: string;
  title: string;
  sku: string;
  regular_price: number;
  discounted_price: number;
  is_campaign: boolean;
  campaign: unknown | null;
  thumbnail: string;
}

/** Variation shape inside checkout cart item */
export interface CheckoutVariationApi {
  id: number;
  type: string;
  value: string;
  image: string;
}

/** Single cart item in checkout summary */
export interface CheckoutCartItemApi {
  id: number;
  campaign_id: number | null;
  product: CheckoutProductApi;
  variation: CheckoutVariationApi | null;
  quantity: number;
  subtotal: number;
}

/** Checkout summary response data */
export interface CheckoutSummaryData {
  amounts: CheckoutAmounts;
  shipping_address: CheckoutShippingAddress | null;
  cart_items: CheckoutCartItemApi[];
}

export interface CheckoutSummaryResponse {
  data: CheckoutSummaryData;
  status: number;
  message: string;
}

/** Fetch checkout summary from GET /checkout/summary */
export async function fetchCheckoutSummary(): Promise<CheckoutSummaryData> {
  const res = await fetch("/api/checkout/summary", {
    headers: { Accept: "application/json", ...getAuthHeaders() },
    cache: "no-store",
  });

  const json = (await res.json().catch(() => ({}))) as CheckoutSummaryResponse;

  if (!res.ok) {
    throw new Error(
      (json.message as string) || `Checkout summary failed: ${res.status}`
    );
  }

  if (json.status !== 200 || !json.data) {
    throw new Error("Invalid checkout summary response");
  }

  return json.data;
}
