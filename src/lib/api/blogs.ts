import { cache } from "react";
import { getBaseUrl } from "./client";
import type {
  BlogDetailApiResponse,
  BlogCommentApiResponse,
  BlogsListApiResponse,
  RelatedBlogsApiResponse,
} from "@/types/blog";

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

/**
 * Blog list: GET /blogs?page=
 * Server-safe (no auth).
 */
export async function fetchBlogs(
  page: number = 1
): Promise<BlogsListApiResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/blogs?page=${encodeURIComponent(page)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
  });

  const json = (await res.json().catch(() => ({}))) as BlogsListApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      json.message ?? `Fetch blogs failed: ${res.status}`
    );
  }

  return json as BlogsListApiResponse;
}

/** All blog post slugs across paginated GET /blogs (for sitemap). */
export async function fetchAllBlogSlugs(): Promise<string[]> {
  const first = await fetchBlogs(1);
  const slugs = first.data.map((b) => b.slug);
  const lastPage = first.meta?.last_page ?? 1;
  let page = 2;
  while (page <= lastPage) {
    const res = await fetchBlogs(page);
    slugs.push(...res.data.map((b) => b.slug));
    page += 1;
  }
  return slugs;
}

/**
 * Blog by slug: GET /blogs/{slug}
 * Server-safe (no auth).
 */
export async function fetchBlogBySlug(slug: string): Promise<BlogDetailApiResponse["data"]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(
    `${baseUrl}/blogs/${encodeURIComponent(slug)}`,
    { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
  );

  const json = (await res.json().catch(() => ({}))) as BlogDetailApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      json.message ?? `Blog fetch failed: ${res.status}`
    );
  }

  if (!json.data) {
    throw new Error("Blog not found");
  }

  return json.data;
}

/** Per-request deduplicated version — use in Server Components (generateMetadata + page body share one fetch). */
export const getCachedBlogBySlug = cache(fetchBlogBySlug);

/**
 * Related blogs: GET /blogs/{id}/related
 * Server-safe (no auth).
 */
export async function fetchRelatedBlogs(
  id: number
): Promise<RelatedBlogsApiResponse["data"]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/blogs/${id}/related`, {
    headers: { Accept: "application/json" },
  });

  const json = (await res.json().catch(() => ({}))) as RelatedBlogsApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      json.message ?? `Related blogs fetch failed: ${res.status}`
    );
  }

  return Array.isArray(json.data) ? json.data : [];
}

/**
 * Post comment: POST /blogs/{id}/comment
 * Requires auth (Bearer token). Call from client only after login check.
 */
export async function postBlogComment(
  blogId: number,
  body: { comment: string }
): Promise<BlogCommentApiResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/blogs/${blogId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as BlogCommentApiResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      json.message ?? `Comment failed: ${res.status}`
    );
  }

  return json as BlogCommentApiResponse;
}
