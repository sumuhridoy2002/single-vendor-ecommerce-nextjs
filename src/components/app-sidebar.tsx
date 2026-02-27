"use client"

import { ChevronDown, ChevronRight, Folder, Zap, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useCategoryTree } from "@/hooks/data/useCategoryTree"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/types/product"

/** Sidebar category item shape (derived from API tree). */
type SidebarCategory = {
  label: string
  href: string
  icon: LucideIcon
  subcategories?: { label: string; href: string; icon: LucideIcon }[]
}

function mapTreeToSidebarCategories(tree: CategoryTreeNode[]): SidebarCategory[] {
  return tree.map((main) => {
    const hasChildren = Array.isArray(main.children) && main.children.length > 0
    return {
      label: main.title,
      href: `/${main.slug}`,
      icon: Folder,
      subcategories: hasChildren
        ? main.children!.map((sub) => ({
          label: sub.title,
          href: `/${main.slug}/${sub.slug}`,
          icon: Folder,
        }))
        : undefined,
    }
  })
}

const flashSaleItem = {
  label: "FLASH SALE",
  href: "/flash-sale",
  icon: Zap,
  badge: "1000+",
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

export function AppSidebar() {
  const pathname = usePathname()
  const tree = useCategoryTree()
  const categories = useMemo(() => mapTreeToSidebarCategories(tree), [tree])
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = useCallback((href: string, open: boolean) => {
    setOpenSection(open ? href : null)
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
                <span className="font-semibold text-destructive">
                  {flashSaleItem.label}
                </span>
                <SidebarMenuBadge className="relative right-0 ml-auto border border-destructive bg-transparent px-2 py-0.5 text-xs font-medium text-foreground">
                  {flashSaleItem.badge}
                </SidebarMenuBadge>
                <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto scrollbar">
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="p-0">
            <SidebarMenu>
              {categories.length === 0 ? (
                <SidebarMenuItem>
                  <div className="py-3 px-3 text-sm text-muted-foreground">
                    Loading categories…
                  </div>
                </SidebarMenuItem>
              ) : (
                categories.map((item) => {
                  const hasChildren =
                    Array.isArray(item.subcategories) && item.subcategories.length > 0
                  const categoryPath = `/category${item.href}`
                  const isMainActive = pathname === categoryPath
                  const isOpen = openSection === item.href

                  return hasChildren ? (
                    <SidebarMenuItem key={item.href}>
                      <Collapsible
                        open={isOpen}
                        onOpenChange={(open) => toggleSection(item.href, open)}
                        className="group/collapsible"
                      >
                        <CollapsibleTrigger asChild>
                          <div
                            role="button"
                            tabIndex={0}
                            data-active={isMainActive}
                            aria-label={isOpen ? "Collapse" : "Expand"}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-0 text-left text-sm outline-hidden",
                              categoryRowClass,
                              isMainActive && "text-primary-dark",
                              "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            )}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                toggleSection(item.href, !isOpen)
                              }
                            }}
                          >
                            <span className="flex flex-1 min-w-0 items-center gap-2">
                              <CategoryIcon icon={item.icon} />
                              <Link
                                href={categoryPath}
                                className="flex min-w-0 items-center gap-2 transition-colors 
                          hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:underline"
                              >
                                <span className="truncate text-base font-medium">{item.label}</span>
                              </Link>
                            </span>
                            <span className="flex shrink-0 items-center justify-center">
                              <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                            </span>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-l-0 mx-0 px-0 py-0 gap-0">
                            {item.subcategories!.map((sub) => {
                              const subPath = `/category${sub.href}`
                              const isSubActive = pathname === subPath
                              return (
                                <SidebarMenuSubItem key={sub.href}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className={cn(
                                      "h-auto border-b border-sidebar-border rounded-none py-2.5 pl-12 pr-3",
                                      isMainActive && "bg-muted"
                                    )}
                                  >
                                    <Link
                                      href={subPath}
                                      className="flex items-center gap-2"
                                    >
                                      <CategoryIcon icon={sub.icon} />
                                      <span className="truncate text-base font-medium">{sub.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isMainActive}
                        className={categoryRowClass}
                      >
                        <Link href={categoryPath} className="flex items-center gap-2">
                          <CategoryIcon icon={item.icon} />
                          <span className="flex-1 truncate text-base font-medium">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
