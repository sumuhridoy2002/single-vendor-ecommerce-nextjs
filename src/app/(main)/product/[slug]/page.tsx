import {
  getCachedProductBySlug,
  mapProductDetailsToProduct,
} from "@/lib/api/products"
import { getSiteOrigin, normalizeMediaUrl } from "@/lib/api/client"
import { fetchSettingsSafe } from "@/lib/api/settings"
import { buildProductJsonLd } from "@/lib/seo/jsonld"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductPageContent } from "./ProductPageContent"

export const revalidate = 900;

type Props = { params: Promise<{ slug: string }> }

function stripHtml(value: string | null | undefined): string | undefined {
  if (!value) return undefined

  const withoutTags = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()

  return withoutTags || undefined
}

function truncateText(value: string | undefined, maxLength: number): string | undefined {
  if (!value) return undefined
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trim()}…`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await getCachedProductBySlug(slug)
    const settings = await fetchSettingsSafe()
    const siteName = settings?.data.site_name ?? "Beauty Care BD"
    const title = data.meta?.title ?? data.title
    const description = truncateText(
      stripHtml(data.meta?.description) ?? stripHtml(data.short_description),
      160
    )
    const keywords = data.meta?.keywords
    const canonicalPath = `/product/${data.slug}`
    const productUrl = `${getSiteOrigin()}${canonicalPath}`
    const imageCandidates = [data.thumbnail, ...(data.gallery ?? [])]
      .map((item) => normalizeMediaUrl(item) ?? item)
      .filter((item, index, arr): item is string => Boolean(item) && arr.indexOf(item) === index)

    const price = data.flash_sale?.is_active
      ? data.flash_sale.flash_final_price
      : data.campaign?.is_active
        ? data.campaign.final_price
        : data.final_price

    return {
      title,
      description,
      keywords: keywords ?? undefined,
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      },
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        url: productUrl,
        siteName,
        title,
        description,
        images: imageCandidates.map((image) => ({
          url: image,
          width: 800,
          height: 800,
          alt: data.title,
        })),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageCandidates,
      },
      other: {
        "product:price:amount": String(price),
        "product:price:currency": "BDT",
        "product:availability": data.is_in_stock ? "in stock" : "out of stock",
        "product:brand": data.brand?.name ?? "",
        "product:category": data.category?.name ?? "",
      },
    }
  } catch {
    return { title: "Product" }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  let initialProduct = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jsonLd: Record<string, any> | null = null

  try {
    const data = await getCachedProductBySlug(slug)
    const settings = await fetchSettingsSafe()
    const siteName = settings?.data.site_name ?? "Beauty Care BD"
    const productUrl = `${getSiteOrigin()}/product/${data.slug}`
    const imageCandidates = [data.thumbnail, ...(data.gallery ?? [])]
      .map((item) => normalizeMediaUrl(item) ?? item)
      .filter((item, index, arr): item is string => Boolean(item) && arr.indexOf(item) === index)

    initialProduct = mapProductDetailsToProduct(data)
    jsonLd = buildProductJsonLd(data, siteName, productUrl, imageCandidates)
  } catch {
    notFound()
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPageContent slug={slug} initialProduct={initialProduct} />
    </>
  )
}
