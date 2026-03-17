"use client"

import { ChevronRight, Folder, Zap, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { useCategoryTree } from "@/hooks/data/useCategoryTree"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/types/product"

/** Get parent category href (empty string for root). */
function getParentHref(href: string): string {
  if (!href.startsWith("/category/") || href === "/category") return ""
  const path = href.slice("/category/".length).split("/").filter(Boolean)
  if (path.length <= 1) return ""
  return `/category/${path.slice(0, -1).join("/")}`
}

/** Build category page href from slug path (supports any depth). */
function getCategoryHref(pathSlugs: string[]): string {
  if (pathSlugs.length === 0) return "/category"
  return `/category/${pathSlugs.join("/")}`
}

const flashSaleItem = {
  label: "FLASH SALE",
  href: "/flash-sale",
  icon: Zap,
}

function CategoryIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
      <Icon className="size-4 text-muted-foreground" />
    </span>
  )
}

const categoryRowClass = cn(
  "h-auto border-b border-sidebar-border rounded-none py-3 px-3",
  "data-[active=true]:bg-muted data-[active=true]:text-primary-dark dark:data-[active=true]:bg-primary-dark/50 dark:data-[active=true]:text-primary-light"
)

const INDENT_PX_PER_LEVEL = 12

interface CategoryTreeItemProps {
  node: CategoryTreeNode
  pathSlugs: string[]
  depth: number
  /** Single open path: only this href and its ancestors are expanded. */
  openPath: string
  toggleOpen: (href: string) => void
}

function CategoryTreeItem({
  node,
  pathSlugs,
  depth,
  openPath,
  toggleOpen,
}: CategoryTreeItemProps) {
  const pathname = usePathname()
  const slugPath = [...pathSlugs, node.slug]
  const href = getCategoryHref(slugPath)
  const hasChildren = Array.isArray(node.children) && node.children.length > 0
  const isActive = pathname === href
  /** Open if this href is the open path or an ancestor of it. */
  const isOpen = openPath === href || (href !== "/category" && openPath.startsWith(href + "/"))
  const indentPx = depth > 0 ? 12 + depth * INDENT_PX_PER_LEVEL : 0
  const isRoot = depth === 0

  if (hasChildren) {
    const trigger = (
      <div
        role="button"
        tabIndex={0}
        data-active={isActive}
        aria-label={isOpen ? "Collapse" : "Expand"}
        style={indentPx > 0 ? { paddingLeft: indentPx } : undefined}
        className={cn(
          "flex w-full cursor-pointer items-center gap-0 text-left text-sm outline-hidden",
          categoryRowClass,
          isActive && "text-primary-dark",
          isOpen && "bg-gray-100/80",
          "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        onClick={() => toggleOpen(href)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleOpen(href)
          }
        }}
      >
        <span className="flex flex-1 min-w-0 items-center gap-2">
          <CategoryIcon icon={Folder} />
          <Link
            href={href}
            className="flex min-w-0 items-center gap-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate text-base font-medium">{node.title}</span>
          </Link>
        </span>
        <span className="flex shrink-0 items-center justify-center">
          <ChevronRight
            className={cn(
              "size-4 transition-transform text-muted-foreground",
              isOpen && "rotate-90"
            )}
            aria-hidden
          />
        </span>
      </div>
    )

    const content = (
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => {
          toggleOpen(open ? href : getParentHref(href))
        }}
        className="group/collapsible"
      >
        {trigger}
        <CollapsibleContent>
          <SidebarMenuSub className="mx-0 px-0 py-0 gap-0 bg-gray-100/50 ml-2">
            {node.children!.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <CategoryTreeItem
                  node={child}
                  pathSlugs={slugPath}
                  depth={depth + 1}
                  openPath={openPath}
                  toggleOpen={toggleOpen}
                />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )

    if (isRoot) {
      return <SidebarMenuItem>{content}</SidebarMenuItem>
    }
    return content
  }

  const linkContent = (
    <>
      <CategoryIcon icon={Folder} />
      <span className="flex-1 truncate text-base font-medium">{node.title}</span>
    </>
  )

  if (isRoot) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={categoryRowClass}
          style={indentPx > 0 ? { paddingLeft: indentPx } : undefined}
        >
          <Link href={href} className="flex items-center gap-2">
            {linkContent}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuSubButton
      asChild
      isActive={isActive}
      className={cn(
        "h-auto border-b border-sidebar-border rounded-none py-2.5 pr-3",
        isActive && "bg-muted"
      )}
      style={indentPx > 0 ? { paddingLeft: indentPx } : undefined}
    >
      <Link href={href} className="flex items-center gap-2">
        {linkContent}
      </Link>
    </SidebarMenuSubButton>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const tree = useCategoryTree()
  const [openPath, setOpenPath] = useState<string>("")
  const prevPathnameRef = useRef(pathname)

  // Sync expansion to current category URL when user navigates (pathname is external source)
  useEffect(() => {
    if (pathname === prevPathnameRef.current) return
    prevPathnameRef.current = pathname
    if (pathname.startsWith("/category/") && pathname !== "/category" && tree.length > 0) {
      // Sync URL → expansion state when route changes (pathname is external)
      queueMicrotask(() => setOpenPath(pathname))
    }
  }, [pathname, tree.length])

  const toggleOpen = useCallback((href: string) => {
    setOpenPath((prev) => {
      const isCurrentlyOpen = prev === href || (href !== "/category" && prev.startsWith(href + "/"))
      if (isCurrentlyOpen) return getParentHref(href)
      return href
    })
  }, [])

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-[70px] z-10 h-[calc(100vh-70px)] w-full flex-col self-start border-r border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border shrink-0 p-0 w-full overflow-x-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-auto py-3 px-3">
              <Link
                href={flashSaleItem.href}
                className="flex w-full items-center gap-2"
              >
                <flashSaleItem.icon className="size-5 shrink-0 text-warning" />
                <span className="font-bold text-destructive text-sm xs:text-base md:text-lg">
                  {flashSaleItem.label}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto scrollbar">
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="p-0">
            <SidebarMenu>
              {tree.length === 0 ? (
                <SidebarMenuItem>
                  <div className="py-3 px-3 text-sm text-muted-foreground">
                    Loading categories…
                  </div>
                </SidebarMenuItem>
              ) : (
                tree.map((node) => (
                  <CategoryTreeItem
                    key={node.id}
                    node={node}
                    pathSlugs={[]}
                    depth={0}
                    openPath={openPath}
                    toggleOpen={toggleOpen}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
