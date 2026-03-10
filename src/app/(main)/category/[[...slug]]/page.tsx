"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment, use } from "react"

import { CategoryHero } from "@/components/category/CategoryHero"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getCategoryBySlugPath, useCategoryTree } from "@/hooks/data/useCategoryTree"
import { useCategories } from "@/hooks/data/useCategories"
import { useCartStore } from "@/store/cart-store"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"

import { SubcategoryProductGrid } from "./components/SubcategoryProductGrid"
import { toast } from "sonner"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = use(params)
  const tree = useCategoryTree()
  const { isLoading } = useCategories()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const whenLoggedIn = useWhenLoggedIn()
  const handleAddToCart = (product: import("@/types/product").Product) => {
    whenLoggedIn(() => {
      addItem(product)
        .then(() => openCart())
        .catch((e) => toast.error(e?.message ?? "Failed to add to cart"))
    })
  }

  if (!slug || slug.length === 0) notFound()

  if (isLoading || tree.length === 0) {
    return (
      <div className="container w-full space-y-6 py-8">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const resolved = getCategoryBySlugPath(slug, tree)
  if (!resolved) notFound()

  const { main, breadcrumb } = resolved

  // Subcategory page: breadcrumb + page title + sort + grid of all products
  if (resolved.type === "sub") {
    return (
      <div className="container w-full space-y-6">
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
        <SubcategoryProductGrid sub={resolved.current} onAddToCart={handleAddToCart} />
      </div>
    )
  }

  // Main category page: hero, subcategory cards, product sections
  return (
    <div className="container w-full space-y-8">
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

      <SubcategoryProductGrid sub={main} onAddToCart={handleAddToCart} />
    </div>
  )
}
