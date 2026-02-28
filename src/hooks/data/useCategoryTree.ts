"use client"

import {
  collectCategoryIds,
  getCategoryHrefById,
  getCategoryIdToTitleMapFromTree,
  mapApiCategoryToTreeNode,
} from "@/lib/category-utils"
import type { CategoryTreeNode } from "@/types/product"
import { useMemo } from "react"

import { useCategories } from "./useCategories"

export interface ResolvedCategory {
  type: "main" | "sub"
  main: CategoryTreeNode
  sub?: CategoryTreeNode
  /** Current node (last in path); use for product filter and sibling cards. */
  current: CategoryTreeNode
  /** Full path from root to current. */
  path: CategoryTreeNode[]
  breadcrumb: { title: string; href: string }[]
}

/** Resolve category from slug path by walking the tree. */
function resolveBySlugPath(
  slug: string[],
  tree: CategoryTreeNode[]
): ResolvedCategory | null {
  if (slug.length === 0) return null
  const path: CategoryTreeNode[] = []
  let node: CategoryTreeNode | undefined
  let nodes = tree
  const breadcrumb: { title: string; href: string }[] = [
    { title: "Home", href: "/" },
  ]

  for (let i = 0; i < slug.length; i++) {
    const seg = slug[i]
    node = nodes.find((n) => n.slug === seg)
    if (!node) return null
    path.push(node)
    const href =
      i === 0
        ? `/category/${node.slug}`
        : `/category/${slug.slice(0, i + 1).join("/")}`
    breadcrumb.push({ title: node.title, href })
    nodes = node.children ?? []
  }

  if (path.length === 0) return null
  const main = path[0]
  const sub = path[1]
  const current = path[path.length - 1]
  return {
    type: path.length === 1 ? "main" : "sub",
    main,
    sub,
    current,
    path,
    breadcrumb,
  }
}

export function useCategoryTree(): CategoryTreeNode[] {
  const { categories: apiCategories, isLoading } = useCategories()
  return useMemo(
    () => apiCategories.map(mapApiCategoryToTreeNode),
    [apiCategories]
  )
}

/** Resolve category from slug path. Requires tree from useCategoryTree. */
export function getCategoryBySlugPath(
  slug: string[] | undefined,
  tree: CategoryTreeNode[]
): ResolvedCategory | null {
  if (!slug || slug.length === 0) return null
  return resolveBySlugPath(slug, tree)
}

/** Sibling subcategories for the current node (its children). */
export function getSiblingSubcategories(
  resolved: ResolvedCategory
): CategoryTreeNode[] {
  return resolved.current.children ?? []
}

/** All category ids under a main (main + all descendants) for product filtering. */
export function getCategoryIdsForMain(main: CategoryTreeNode): string[] {
  return collectCategoryIds(main)
}

/** Flat map category id → title (whole tree). */
export function getCategoryIdToTitleMap(tree: CategoryTreeNode[]): Record<string, string> {
  return getCategoryIdToTitleMapFromTree(tree)
}

export { getCategoryHrefById } from "@/lib/category-utils"
