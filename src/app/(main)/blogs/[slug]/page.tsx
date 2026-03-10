import { fetchBlogBySlug, fetchRelatedBlogs } from "@/lib/api/blogs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "./BlogPostContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchBlogBySlug(slug);
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
    blog = await fetchBlogBySlug(slug);
  } catch {
    notFound();
  }

  let related: Awaited<ReturnType<typeof fetchRelatedBlogs>> = [];
  try {
    related = await fetchRelatedBlogs(blog.id);
  } catch {
    // non-fatal
  }

  return <BlogPostContent blog={blog} relatedBlogs={related} />;
}
