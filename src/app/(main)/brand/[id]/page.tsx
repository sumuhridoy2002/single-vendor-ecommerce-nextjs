import { fetchBrandById } from "@/lib/api/brands"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BrandPageContent } from "./BrandPageContent"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const { brand } = await fetchBrandById(id)
    return {
      title: brand.name,
      description: brand.description ?? undefined,
      openGraph: {
        title: brand.name,
        ...(brand.image && { images: [brand.image] }),
      },
    }
  } catch {
    return { title: "Brand" }
  }
}

export default async function BrandPage({ params }: Props) {
  const { id } = await params
  let result: Awaited<ReturnType<typeof fetchBrandById>>
  try {
    result = await fetchBrandById(id)
  } catch {
    notFound()
  }

  return (
    <BrandPageContent brand={result.brand} products={result.products} />
  )
}
