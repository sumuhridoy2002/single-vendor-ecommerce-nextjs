"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment, use } from "react"

import { CategoryHero } from "@/components/category/CategoryHero"
import { SubcategoryCards } from "@/components/category/SubcategoryCards"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getCategoryBySlugPath, getSiblingSubcategories } from "@/hooks/data/useCategoryTree"
import { useCartStore } from "@/store/cart-store"

import { CategoryProductsHighlight } from "./components/CategoryProductsHighlight"
import { CategorySectionBySub } from "./components/CategorySectionBySub"
import { SubcategoryProductGrid } from "./components/SubcategoryProductGrid"
import { SECTION_BG_CLASSES } from "./components/constants"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = use(params)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const handleAddToCart = (product: import("@/types/product").Product) => {
    addItem(product)
    openCart()
  }

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
        <SubcategoryProductGrid sub={sub} onAddToCart={handleAddToCart} />
      </div>
    )
  }

  // Main category page: hero, subcategory cards, product sections
  return (
    <div className="container w-full space-y-8 py-10">
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
          onAddToCart={handleAddToCart}
        />
        {siblings.map((subNode, index) => (
          <CategorySectionBySub
            key={subNode.id}
            sub={subNode}
            mainSlug={main.slug}
            sectionBgClassName={
              SECTION_BG_CLASSES[index % SECTION_BG_CLASSES.length]
            }
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  )
}
