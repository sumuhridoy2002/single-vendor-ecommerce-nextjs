import type { CategoryApiNode } from "@/types/category"
import type { CategoryTreeNode } from "@/types/product"

/** Map API category node to app CategoryTreeNode (recursive). */
export function mapApiCategoryToTreeNode(api: CategoryApiNode): CategoryTreeNode {
  return {
    id: String(api.id),
    title: api.name,
    slug: api.slug,
    image: api.image,
    children:
      api.children && api.children.length > 0
        ? api.children.map(mapApiCategoryToTreeNode)
        : undefined,
  }
}

/** Collect category id and all descendant ids. */
export function collectCategoryIds(node: CategoryTreeNode): string[] {
  const ids = [node.id]
  node.children?.forEach((c) => ids.push(...collectCategoryIds(c)))
  return ids
}

/** Build flat id → title from tree. */
export function getCategoryIdToTitleMapFromTree(
  tree: CategoryTreeNode[]
): Record<string, string> {
  const map: Record<string, string> = {}
  function walk(nodes: CategoryTreeNode[]) {
    for (const n of nodes) {
      map[n.id] = n.title
      if (n.children?.length) walk(n.children)
    }
  }
  walk(tree)
  return map
}

/** Find category href by id (path from root to node). */
export function getCategoryHrefById(
  tree: CategoryTreeNode[],
  categoryId: string
): string {
  function findPath(
    nodes: CategoryTreeNode[],
    path: string[]
  ): string[] | null {
    for (const n of nodes) {
      const next = [...path, n.slug]
      if (n.id === categoryId) return next
      if (n.children?.length) {
        const found = findPath(n.children, next)
        if (found) return found
      }
    }
    return null
  }
  const path = findPath(tree, [])
  return path ? `/category/${path.join("/")}` : `/category/${categoryId}`
}

/** Every category URL as `/category/a` or `/category/a/b` for SEO sitemaps. */
export function collectCategoryPaths(nodes: CategoryTreeNode[]): string[] {
  const out: string[] = []

  function walk(list: CategoryTreeNode[], ancestors: string[]) {
    for (const n of list) {
      const segs = [...ancestors, n.slug]
      out.push(`/category/${segs.join("/")}`)
      if (n.children?.length) walk(n.children, segs)
    }
  }

  walk(nodes, [])
  return out
}
