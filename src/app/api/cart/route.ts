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

/** GET /api/cart -> GET backend /cart */
export async function GET(request: NextRequest) {
  try {
    const res = await fetch(getBackendUrl("cart"), {
      headers: { Accept: "application/json", ...getAuthHeaders(request) },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Cart fetch failed" },
      { status: 502 }
    );
  }
}
