import { getBaseUrl } from "./client";
import type { SubscribeResponse } from "@/types/blog";

/**
 * Subscribe to newsletter: POST /subscribe
 * No auth required.
 */
export async function subscribeNewsletter(
  email: string
): Promise<SubscribeResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  const json = (await res.json().catch(() => ({}))) as SubscribeResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      json.message ?? `Subscribe failed: ${res.status}`
    );
  }

  return json;
}
