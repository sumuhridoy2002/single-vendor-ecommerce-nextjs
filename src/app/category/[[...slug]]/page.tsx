"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"

import { CategoryHero } from "@/components/category/CategoryHero"
import { SubcategoryCards } from "@/components/category/SubcategoryCards"
import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { ProductCard } from "@/components/common/ProductCard"
import type { ResolvedCategory } from "@/hooks/data/useCategoryTree"
import {
  getCategoryBySlugPath,
  getCategoryIdsForMain,
  getSiblingSubcategories,
} from "@/hooks/data/useCategoryTree"
import { useProductsByCategory } from "@/hooks/data/useProducts"
import type { CategoryTreeNode } from "@/types/product"

const SECTION_BG_CLASSES = [
  "bg-sky-50/60 dark:bg-sky-950/20",
  "bg-pink-50/60 dark:bg-pink-950/20",
  "bg-amber-50/60 dark:bg-amber-950/20",
  "bg-emerald-50/60 dark:bg-emerald-950/20",
  "bg-violet-50/60 dark:bg-violet-950/20",
  "bg-rose-50/60 dark:bg-rose-950/20",
]

/** Subcategory page: title, sort dropdown, and grid of all products. */
function SubcategoryProductGrid({ sub }: { sub: CategoryTreeNode }) {
  const products = useProductsByCategory(sub.id)

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {sub.title}
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-subcategory" className="text-sm text-muted-foreground">
            Sort by:
          </label>
          <select
            id="sort-subcategory"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue=""
          >
            <option value="">Select an option</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

/** Top product section for current category (main page only; same style as home page). */
function CategoryProductsHighlight({
  resolved,
  sectionBgClassName,
}: {
  resolved: ResolvedCategory
  sectionBgClassName: string
}) {
  const { main, type, sub } = resolved
  const categoryIds = type === "sub" && sub ? sub.id : getCategoryIdsForMain(main)
  const products = useProductsByCategory(categoryIds)
  const title = type === "sub" && sub ? sub.title : `Products in ${main.title}`
  const viewAllHref =
    type === "sub" && sub
      ? `/category/${main.slug}/${sub.slug}`
      : `/category/${main.slug}`

  return (
    <CategoryProductSection
      title={title}
      products={products}
      viewAllHref={viewAllHref}
      sectionBgClassName={sectionBgClassName}
    />
  )
}

function CategorySectionBySub({
  sub,
  mainSlug,
  sectionBgClassName,
}: {
  sub: CategoryTreeNode
  mainSlug: string
  sectionBgClassName: string
}) {
  const products = useProductsByCategory(sub.id)
  return (
    <CategoryProductSection
      title={sub.title}
      products={products}
      viewAllHref={`/category/${mainSlug}/${sub.slug}`}
      sectionBgClassName={sectionBgClassName}
    />
  )
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = use(params)
  if (!slug || slug.length === 0) notFound()

  const resolved = getCategoryBySlugPath(slug)
  if (!resolved) notFound()

  const { main, sub, breadcrumb } = resolved
  const siblings = getSiblingSubcategories(resolved)

  // Subcategory page: breadcrumb + page title + sort + grid of all products
  if (resolved.type === "sub" && sub) {
    return (
      <div className="w-full space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          {breadcrumb.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-muted-foreground/60" aria-hidden>
                  /
                </span>
              )}
              {i === breadcrumb.length - 1 ? (
                <span className="text-foreground" aria-current="page">
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground hover:underline"
                >
                  {item.title}
                </Link>
              )}
            </span>
          ))}
        </nav>
        <SubcategoryProductGrid sub={sub} />
      </div>
    )
  }

  // Main category page: hero, subcategory cards, product sections
  return (
    <div className="w-full space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        {breadcrumb.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-muted-foreground/60" aria-hidden>
                /
              </span>
            )}
            {i === breadcrumb.length - 1 ? (
              <span className="text-foreground" aria-current="page">
                {item.title}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline"
              >
                {item.title}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <CategoryHero title={main.title} />

      {siblings.length > 0 && (
        <SubcategoryCards subcategories={siblings} mainSlug={main.slug} />
      )}

      <div className="space-y-0">
        <CategoryProductsHighlight
          resolved={resolved}
          sectionBgClassName={SECTION_BG_CLASSES[0]}
        />
        {siblings.map((subNode, index) => (
          <CategorySectionBySub
            key={subNode.id}
            sub={subNode}
            mainSlug={main.slug}
            sectionBgClassName={
              SECTION_BG_CLASSES[index % SECTION_BG_CLASSES.length]
            }
          />
        ))}
      </div>
    </div>
  )
}
