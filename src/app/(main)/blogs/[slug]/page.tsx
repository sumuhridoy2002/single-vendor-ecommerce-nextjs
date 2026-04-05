import { getCachedBlogBySlug, fetchBlogs, fetchRelatedBlogs } from "@/lib/api/blogs";
import { fetchSettingsSafe } from "@/lib/api/settings";
import { getSiteOrigin } from "@/lib/api/client";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "./BlogPostContent";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const res = await fetchBlogs(1);
    return (res.data ?? []).map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getCachedBlogBySlug(slug);
    const title = data.meta?.title ?? data.title;
    const description =
      data.meta?.description ?? data.short_description ?? undefined;
    const keywords = data.meta?.keywords ?? undefined;
    return {
      title,
      description: description?.slice(0, 160) ?? undefined,
      keywords: keywords ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        type: "website",
        ...(data.banner && {
          images: [
            {
              url: data.banner,
              width: 600,
              height: 200,
              alt: data.title,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description ?? undefined,
        ...(data.banner && { images: [data.banner] }),
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  let blog;
  try {
    blog = await getCachedBlogBySlug(slug);
  } catch {
    notFound();
  }

  let related: Awaited<ReturnType<typeof fetchRelatedBlogs>> = [];
  try {
    related = await fetchRelatedBlogs(blog.id);
  } catch {
    // non-fatal
  }

  const settings = await fetchSettingsSafe();
  const siteUrl = getSiteOrigin();
  const siteName = settings?.data.site_name ?? "Beauty Care BD";
  const jsonLd = buildArticleJsonLd(blog, siteUrl, siteName);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent blog={blog} relatedBlogs={related} />
    </>
  );
}
