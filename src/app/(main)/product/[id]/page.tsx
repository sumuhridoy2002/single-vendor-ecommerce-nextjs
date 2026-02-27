import {
  fetchProductById,
  mapProductDetailsToProduct,
} from "@/lib/api/products"
import { ProductPageContent } from "./ProductPageContent"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const data = await fetchProductById(id)
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
  const { id } = await params
  let initialProduct = null
  try {
    const data = await fetchProductById(id)
    initialProduct = mapProductDetailsToProduct(data)
  } catch {
    notFound()
  }

  return (
    <ProductPageContent id={id} initialProduct={initialProduct} />
  )
}
