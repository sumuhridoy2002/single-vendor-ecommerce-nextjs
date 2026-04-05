import { fetchPageBySlug } from "@/lib/api/pages";
import { getSiteOrigin } from "@/lib/api/client";
import { buildCmsPageJsonLd } from "@/lib/seo/jsonld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPageContent } from "./CmsPageContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await fetchPageBySlug(slug);
    const meta = page.meta;
    const title = meta?.meta_title ?? page.title;
    const description = meta?.meta_description ?? undefined;
    const keywords = meta?.meta_keywords ?? undefined;
    return {
      title,
      description: description?.slice(0, 160) ?? undefined,
      keywords: keywords ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        type: "website",
        ...(page.banner && {
          images: [
            {
              url: page.banner,
              width: 600,
              height: 200,
              alt: page.title,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description ?? undefined,
        ...(page.banner && { images: [page.banner] }),
      },
    };
  } catch {
    return { title: "Page" };
  }
}

export default async function CmsPageRoute({ params }: Props) {
  const { slug } = await params;
  let page;
  try {
    page = await fetchPageBySlug(slug);
  } catch {
    notFound();
  }

  const siteUrl = getSiteOrigin();
  const jsonLd = buildCmsPageJsonLd(page, siteUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CmsPageContent page={page} />
    </>
  );
}
