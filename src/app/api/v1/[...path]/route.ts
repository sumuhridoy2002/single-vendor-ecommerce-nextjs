import { getBaseUrl } from "@/lib/api/client";
import { NextRequest, NextResponse } from "next/server";

const FORWARD_HEADERS = [
  "authorization",
  "content-type",
  "accept",
  "accept-language",
] as const;

function buildBackendUrl(pathSegments: string[], request: NextRequest): string {
  const base = getBaseUrl();
  const path = pathSegments.join("/");
  const url = path ? `${base}/${path}` : base;
  const search = request.nextUrl.searchParams.toString();
  return search ? `${url}?${search}` : url;
}

function getForwardHeaders(request: NextRequest): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of FORWARD_HEADERS) {
    const value = request.headers.get(name);
    if (value) out[name] = value;
  }
  return out;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

async function proxy(
  request: NextRequest,
  { path }: { path: string[] }
): Promise<NextResponse> {
  try {
    const url = buildBackendUrl(path, request);
    const headers = getForwardHeaders(request);
    const init: RequestInit = {
      method: request.method,
      headers: { ...headers, Accept: "application/json" },
      cache: "no-store",
    };
    // Use ArrayBuffer for request bodies. `request.text()` corrupts multipart/binary
    // uploads (e.g. review images) by decoding bytes as UTF-8.
    if (request.method !== "GET" && request.method !== "HEAD") {
      const buf = await request.arrayBuffer();
      if (buf.byteLength > 0) {
        init.body = buf;
      }
    }
    const res = await fetch(url, init);
    const contentType = res.headers.get("content-type") ?? "application/json";
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("[api/v1 proxy]", err);
    return NextResponse.json(
      { message: "Proxy request failed" },
      { status: 502 }
    );
  }
}
