import {
  fetchProductBySlug,
  mapProductDetailsToProduct,
} from "@/lib/api/products"
import { getSiteOrigin, normalizeMediaUrl } from "@/lib/api/client"
import { fetchSettingsSafe } from "@/lib/api/settings"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductPageContent } from "./ProductPageContent"

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
    const data = await fetchProductBySlug(slug)
    const settings = await fetchSettingsSafe()
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
    return {
      title,
      description,
      keywords: keywords ?? undefined,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: "website",
        url: productUrl,
        siteName: settings?.data.site_name ?? "Beauty Care BD",
        title,
        description,
        images: imageCandidates.map((image) => ({
          url: image,
          alt: data.title,
        })),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageCandidates,
      },
    }
  } catch {
    return { title: "Product" }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  let initialProduct = null
  try {
    const data = await fetchProductBySlug(slug)
    initialProduct = mapProductDetailsToProduct(data)
  } catch {
    notFound()
  }

  return (
    <ProductPageContent slug={slug} initialProduct={initialProduct} />
  )
}
