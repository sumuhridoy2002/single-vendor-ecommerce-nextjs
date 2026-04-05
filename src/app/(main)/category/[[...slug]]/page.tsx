import type { Metadata } from "next"
import { fetchCategories } from "@/lib/api/categories"
import type { CategoryApiNode } from "@/types/category"
import { getSiteOrigin } from "@/lib/api/client"
import { buildCollectionPageJsonLd } from "@/lib/seo/jsonld"
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

/**
 * Resolve all ancestors of a target slug, returning an ordered path from root
 * to the matched node. Returns empty array if not found.
 */
function resolveCategoryPath(
  nodes: CategoryApiNode[],
  targetSlug: string,
  ancestors: CategoryApiNode[] = []
): CategoryApiNode[] {
  for (const node of nodes) {
    const path = [...ancestors, node]
    if (node.slug === targetSlug) return path
    const found = resolveCategoryPath(node.children, targetSlug, path)
    if (found.length) return found
  }
  return []
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  let schemas: ReturnType<typeof buildCollectionPageJsonLd> = []

  if (slug?.length) {
    try {
      const siteUrl = getSiteOrigin()
      const categories = await fetchCategories()
      const lastSlug = slug[slug.length - 1]
      const categoryPath = resolveCategoryPath(categories, lastSlug)

      if (categoryPath.length) {
        const leaf = categoryPath[categoryPath.length - 1]
        const breadcrumbs = [
          { name: "Home", url: siteUrl },
          ...categoryPath.map((node) => ({
            name: node.name,
            url: `${siteUrl}/category/${node.slug}`,
          })),
        ]

        schemas = buildCollectionPageJsonLd({
          name: leaf.name,
          description: leaf.description,
          url: `${siteUrl}/category/${lastSlug}`,
          imageUrl: leaf.image ?? leaf.banner,
          breadcrumbs,
        })
      }
    } catch {
      // non-fatal — skip JSON-LD on error
    }
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CategoryPageContent params={params} />
    </>
  )
}
