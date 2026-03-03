import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_SESSION_COOKIE } from "@/lib/auth-cookie";

const ACCOUNT_PATH_PREFIX = "/account";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ACCOUNT_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(ACCOUNT_SESSION_COOKIE);
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account/:path*"],
};
