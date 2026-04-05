import type {
  CmsPageDetail,
  CmsPageListItem,
  PageDetailApiResponse,
  PagesListApiResponse,
} from "@/types/cms-page";
import { getBaseUrl } from "./client";

export async function fetchPages(): Promise<CmsPageListItem[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/pages`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error(`Pages fetch failed: ${res.status}`);
  }

  const json = (await res.json()) as PagesListApiResponse;
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load pages");
  }

  return json.data;
}

export async function fetchPageBySlug(slug: string): Promise<CmsPageDetail> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/pages/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Page fetch failed: ${res.status}`);
  }

  const json = (await res.json()) as PageDetailApiResponse;
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load page");
  }

  return json.data;
}
