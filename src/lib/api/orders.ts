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

/** Request body for POST /orders/place */
export interface PlaceOrderPayload {
  address_id: number;
  payment_method: "cod";
  coupon_code?: string;
}

/** Shipping info in placed order response */
export interface PlacedOrderShippingInfo {
  receiver_name: string;
  receiver_phone: string;
  address: string;
  city: string;
}

/** Amounts in placed order response */
export interface PlacedOrderAmounts {
  subtotal: number;
  discount: number;
  shipping: number;
  grand_total: number;
}

/** Status in placed order response */
export interface PlacedOrderStatus {
  order: string;
  payment: string;
  payment_method: string;
}

/** Line item in placed order response */
export interface PlacedOrderItem {
  id: number;
  product_name: string;
  variation: string | null;
  quantity: string;
  unit_price: number;
  total_price: number;
}

/** Single placed order as returned by POST /orders/place */
export interface PlacedOrderData {
  id: number;
  order_no: string;
  tracking_no: string;
  shipping_info: PlacedOrderShippingInfo;
  amounts: PlacedOrderAmounts;
  status: PlacedOrderStatus;
  items: PlacedOrderItem[];
  date: string;
}

/** Order list item (GET /orders) – same shape but without items */
export interface OrderListItem {
  id: number;
  order_no: string;
  tracking_no: string;
  shipping_info: PlacedOrderShippingInfo;
  amounts: PlacedOrderAmounts;
  status: PlacedOrderStatus;
  date: string;
}

/** Pagination links from GET /orders */
export interface OrdersListLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

/** Meta link for pagination */
export interface OrdersMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

/** Pagination meta from GET /orders */
export interface OrdersListMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: OrdersMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface OrdersListApiResponse {
  data: OrderListItem[];
  links: OrdersListLinks;
  meta: OrdersListMeta;
  status: number;
}

export interface OrderDetailApiResponse {
  data: PlacedOrderData;
  status: number;
}

/** Single step in track order response */
export interface TrackOrderHistoryItem {
  title: string;
  time: string;
}

/** Response from GET /orders/track/{tracking_no} */
export interface TrackOrderApiResponse {
  data: PlacedOrderData;
  status: number;
  tracking_history: TrackOrderHistoryItem[];
}

export interface PlaceOrderApiResponse {
  data: PlacedOrderData;
  status: number;
  message: string;
}

/**
 * Place order: POST /orders/place
 * Returns the placed order data on success.
 */
export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<PlaceOrderApiResponse> {
  const baseUrl = getBaseUrl();
  const body: Record<string, unknown> = {
    address_id: payload.address_id,
    payment_method: payload.payment_method,
  };
  if (payload.coupon_code?.trim()) {
    body.coupon_code = payload.coupon_code.trim();
  }

  const res = await fetch(`${baseUrl}/orders/place`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as PlaceOrderApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message || `Place order failed: ${res.status}`
    );
  }

  return json as PlaceOrderApiResponse;
}

/**
 * Order history: GET /orders
 * Optional page for pagination (default 1).
 */
export async function getOrders(
  page: number = 1
): Promise<OrdersListApiResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/orders?page=${encodeURIComponent(page)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });

  const json = (await res.json().catch(() => ({}))) as OrdersListApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message || `Fetch orders failed: ${res.status}`
    );
  }

  return json as OrdersListApiResponse;
}

/**
 * Order details: GET /orders/{id}
 */
export async function getOrderById(
  id: number | string
): Promise<OrderDetailApiResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/orders/${id}`, {
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });

  const json = (await res.json().catch(() => ({}))) as OrderDetailApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message ||
        `Fetch order failed: ${res.status}`
    );
  }

  return json as OrderDetailApiResponse;
}

/**
 * Track order by tracking number: GET /orders/track/{tracking_no}
 */
export async function getTrackOrder(
  trackingNo: string
): Promise<TrackOrderApiResponse> {
  const baseUrl = getBaseUrl();
  const encoded = encodeURIComponent(trackingNo.trim());
  const res = await fetch(`${baseUrl}/orders/track/${encoded}`, {
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });

  const json = (await res.json().catch(() => ({}))) as TrackOrderApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message ||
        `Track order failed: ${res.status}`
    );
  }

  return json as TrackOrderApiResponse;
}
