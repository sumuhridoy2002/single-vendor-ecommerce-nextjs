import { fetchBrandBySlug } from "@/lib/api/brands"
import { getSiteOrigin } from "@/lib/api/client"
import { buildBrandJsonLd } from "@/lib/seo/jsonld"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BrandPageContent } from "./BrandPageContent"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { brand } = await fetchBrandBySlug(slug)
    const title = brand.meta?.title ?? brand.name
    const description = brand.meta?.description ?? brand.description ?? undefined
    const keywords = brand.meta?.keywords ?? undefined
    return {
      title,
      description,
      keywords: keywords ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        ...(brand.image && { images: [brand.image] }),
      },
    }
  } catch {
    return { title: "Brand" }
  }
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params
  let result: Awaited<ReturnType<typeof fetchBrandBySlug>>
  try {
    result = await fetchBrandBySlug(slug)
  } catch {
    notFound()
  }

  const siteUrl = getSiteOrigin()
  const jsonLd = buildBrandJsonLd(result.brand, siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BrandPageContent brand={result.brand} />
    </>
  )
}
