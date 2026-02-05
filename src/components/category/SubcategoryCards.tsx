"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/types/product"

const CARD_BG_CLASSES = [
  "bg-danger-light/80 dark:bg-danger-dark/30",
  "bg-info-light/80 dark:bg-info-dark/30",
  "bg-warning-light/80 dark:bg-warning-dark/30",
  "bg-success-light/80 dark:bg-success-dark/30",
  "bg-primary-light/80 dark:bg-primary-dark/30",
  "bg-muted-light/80 dark:bg-muted-dark/30",
]

export interface SubcategoryCardsProps {
  subcategories: CategoryTreeNode[]
  mainSlug: string
  className?: string
}

export function SubcategoryCards({
  subcategories,
  mainSlug,
  className,
}: SubcategoryCardsProps) {
  if (subcategories.length === 0) return null

  return (
    <section className={cn("w-full", className)}>
      <h2 className="mb-4 text-lg font-semibold text-foreground md:text-xl">
        Shop by category
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {subcategories.map((sub, index) => {
          const href = `/category/${mainSlug}/${sub.slug}`
          const bgClass =
            CARD_BG_CLASSES[index % CARD_BG_CLASSES.length]
          return (
            <Link
              key={sub.id}
              href={href}
              className={cn(
                "group flex flex-col items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/50",
                bgClass
              )}
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-background/80 text-2xl font-medium text-foreground shadow-sm">
                {sub.title.charAt(0)}
              </span>
              <span className="line-clamp-2 text-center text-sm font-medium text-foreground group-hover:text-primary">
                {sub.title}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
