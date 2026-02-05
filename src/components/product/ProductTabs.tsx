"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

export interface ProductTabsProps {
  product: Product
  className?: string
}

export function ProductTabs({ product, className }: ProductTabsProps) {
  const description =
    product.description ??
    "No detailed description available for this product."
  const specification = product.specification ?? {}

  return (
    <Tabs defaultValue="details" className={cn("w-full", className)}>
      <TabsList className="w-full justify-start rounded-lg border bg-muted/30 p-1">
        <TabsTrigger value="details" className="flex-1 sm:flex-none">
          Product Details
        </TabsTrigger>
        <TabsTrigger value="specification" className="flex-1 sm:flex-none">
          Specification
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mt-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground whitespace-pre-line">{description}</p>
          <p className="mt-4">
            <a
              href="/return-policy"
              className="text-sm font-medium text-primary hover:underline"
            >
              Return Policy
            </a>
          </p>
        </div>
      </TabsContent>
      <TabsContent value="specification" className="mt-4">
        {Object.keys(specification).length > 0 ? (
          <dl className="grid gap-2 sm:grid-cols-2">
            {Object.entries(specification).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between gap-4 border-b border-border py-2 last:border-0"
              >
                <dt className="text-sm font-medium text-muted-foreground">
                  {key}
                </dt>
                <dd className="text-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            No specification available for this product.
          </p>
        )}
      </TabsContent>
    </Tabs>
  )
}
