import {
  fetchProductBySlug,
  mapProductDetailsToProduct,
} from "@/lib/api/products"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductPageContent } from "./ProductPageContent"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await fetchProductBySlug(slug)
    const title = data.meta?.title ?? data.title
    const description = data.meta?.description ?? data.short_description
    const keywords = data.meta?.keywords
    return {
      title,
      description: description?.slice(0, 160) ?? undefined,
      keywords: keywords ?? undefined,
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
