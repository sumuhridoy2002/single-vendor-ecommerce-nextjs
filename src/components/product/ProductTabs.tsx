"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { RatingReviews } from "./RatingReviews"

/** Decode HTML entities so escaped API content (e.g. &lt; &gt; &amp;) renders as real HTML. Works in SSR and client. */
function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export interface ProductTabsProps {
  product: Product
  className?: string
  onReviewSubmitted: () => void
}

export function ProductTabs({ product, className, onReviewSubmitted }: ProductTabsProps) {
  const longDesc = product.longDescription ?? product.description
  const raw =
    longDesc ?? "No detailed description available for this product."
  const specification = product.specification ?? {}
  const isEscapedHtml = raw.includes("&lt;") || raw.includes("&gt;")
  const isRawHtml = raw.includes("<") && raw.includes(">")
  const contentToRender =
    isEscapedHtml ? decodeHtmlEntities(raw) : raw
  const useHtml = isRawHtml || isEscapedHtml

  return (
    <Tabs defaultValue="details" className={cn("w-full", className)}>
      <TabsList className="w-full justify-start rounded-lg border bg-muted/30 p-1">
        <TabsTrigger value="details" className="flex-1 sm:flex-none">
          Product Details
        </TabsTrigger>
        <TabsTrigger value="specification" className="flex-1 sm:flex-none">
          Specification
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
          Reviews
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mt-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {useHtml ? (
            <div
              className="text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h3]:mt-4 [&_h3]:text-base [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: contentToRender }}
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-line">
              {contentToRender}
            </p>
          )}
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
      <TabsContent value="reviews" className="mt-4">
        <RatingReviews product={product} onReviewSubmitted={onReviewSubmitted} />
      </TabsContent>
    </Tabs>
  )
}
