"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type HomeCategoryItem = {
  label: string
  href: string
  icon: LucideIcon
}

export interface HomeCategoryGridProps {
  title?: string
  categories: HomeCategoryItem[]
  className?: string
  sectionBgClassName?: string
}

const CATEGORY_BASE_PATH = "/category"

export function HomeCategoryGrid({
  title = "All You Need",
  categories,
  className,
  sectionBgClassName,
}: HomeCategoryGridProps) {
  return (
    <section
      className={cn(
        "min-w-0 px-4 py-6 md:px-6 md:py-8",
        sectionBgClassName,
        className
      )}
    >
      <h2 className="mb-4 text-lg font-semibold text-foreground md:text-xl">
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8">
        {categories.map((item) => {
          const Icon = item.icon
          const href = `${CATEGORY_BASE_PATH}${item.href}`
          return (
            <Link
              key={item.href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="size-6 text-muted-foreground" />
              </span>
              <span className="text-xs font-medium text-foreground line-clamp-2">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
