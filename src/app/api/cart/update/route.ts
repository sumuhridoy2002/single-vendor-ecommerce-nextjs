import { getBaseUrl } from "@/lib/api/client";
import { NextRequest, NextResponse } from "next/server";

function getBackendUrl(path: string): string {
  const base = getBaseUrl();
  return `${base}/${path.replace(/^\//, "")}`;
}

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const auth = request.headers.get("Authorization");
  if (!auth) return {};
  return { Authorization: auth };
}

/** POST /api/cart/update -> POST backend /cart/update */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const res = await fetch(getBackendUrl("cart/update"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(request),
      },
      body,
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Cart update failed" },
      { status: 502 }
    );
  }
}
