import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FAKE_ACCESS_TOKEN = "fake-access-token";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("access_token")?.value;
  const token = bearerToken ?? cookieToken;

  if (!token || token !== FAKE_ACCESS_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = {
    id: "1",
    email: "mahadih.dev@gmail.com",
    name: "Mahadi Hasan",
  };

  return NextResponse.json(user);
}
