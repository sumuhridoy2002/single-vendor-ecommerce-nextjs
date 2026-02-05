"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment, use } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  "bg-info-light/60 dark:bg-info-dark/20",
  "bg-danger-light/60 dark:bg-danger-dark/20",
  "bg-warning-light/60 dark:bg-warning-dark/20",
  "bg-success-light/60 dark:bg-success-dark/20",
  "bg-primary-light/60 dark:bg-primary-dark/20",
  "bg-muted-light/60 dark:bg-muted-dark/20",
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
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, i) => (
              <Fragment key={item.href}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {i === breadcrumb.length - 1 ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <SubcategoryProductGrid sub={sub} />
      </div>
    )
  }

  // Main category page: hero, subcategory cards, product sections
  return (
    <div className="w-full space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumb.map((item, i) => (
            <Fragment key={item.href}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {i === breadcrumb.length - 1 ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

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
