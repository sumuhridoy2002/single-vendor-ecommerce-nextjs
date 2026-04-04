import { fetchSettingsSafe } from "@/lib/api/settings";
import { getSiteOrigin } from "@/lib/api/client";
import { buildBlogListJsonLd } from "@/lib/seo/jsonld";
import type { Metadata } from "next";
import { BlogsListClient } from "./BlogsListClient";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read our latest articles on skincare, beauty tips, and product guides.",
};

export default async function BlogsPage() {
  const settings = await fetchSettingsSafe();
  const siteUrl = getSiteOrigin();
  const siteName = settings?.data.site_name ?? "Beauty Care BD";
  const jsonLd = buildBlogListJsonLd(
    siteName,
    siteUrl,
    "Read our latest articles on skincare, beauty tips, and product guides."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogsListClient />
    </>
  );
}
