import type { Metadata } from "next"
import { fetchCategories } from "@/lib/api/categories"
import type { CategoryApiNode } from "@/types/category"
import { CategoryPageContent } from "./CategoryPageContent"

type Props = { params: Promise<{ slug?: string[] }> }

function findCategoryBySlug(
  nodes: CategoryApiNode[],
  slug: string
): CategoryApiNode | undefined {
  for (const node of nodes) {
    if (node.slug === slug) return node
    const found = findCategoryBySlug(node.children, slug)
    if (found) return found
  }
  return undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!slug?.length) return { title: "Category" }

  try {
    const categories = await fetchCategories()
    const lastSlug = slug[slug.length - 1]
    const category = findCategoryBySlug(categories, lastSlug)

    if (!category) return { title: "Category" }

    const title = category.meta?.title ?? category.name
    const description =
      category.meta?.description ??
      category.description ??
      `Browse ${category.name} products`

    return {
      title,
      description: description?.slice(0, 160) ?? undefined,
      keywords: category.meta?.keywords ?? undefined,
    }
  } catch {
    return { title: "Category" }
  }
}

export default function CategoryPage({ params }: Props) {
  return <CategoryPageContent params={params} />
}
