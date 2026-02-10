import { NextRequest, NextResponse } from "next/server";

const FAKE_ACCESS_TOKEN = "fake-access-token";
const FAKE_REFRESH_TOKEN = "fake-refresh-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const _password = body?.password;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = {
      id: "1",
      email: email || "demo@example.com",
      name: email.includes("mahadi") ? "Mahadi Hasan" : email.split("@")[0] || "User",
    };

    return NextResponse.json({
      user,
      accessToken: FAKE_ACCESS_TOKEN,
      refreshToken: FAKE_REFRESH_TOKEN,
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}
