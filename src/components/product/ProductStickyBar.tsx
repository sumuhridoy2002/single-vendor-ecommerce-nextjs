"use client"

import { Button } from "@/components/ui/button"
import { normalizeMediaUrl } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import type { RefObject } from "react"

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount)
}

export interface ProductStickyBarProps {
  product: Product
  thumbnailSrc: string
  visible: boolean
  scrollTargetRef: RefObject<HTMLElement | null>
  onAddToCart: (
    product: Product,
    quantity?: number,
    options?: { variationId?: number }
  ) => void
}

export function ProductStickyBar({
  product,
  thumbnailSrc,
  visible,
  scrollTargetRef,
  onAddToCart,
}: ProductStickyBarProps) {
  const hasVariations = (product.variations?.length ?? 0) > 0
  const inStock = product.inStock ?? true
  const stockQty = product.stockQty
  const isOutOfStock = !inStock || (stockQty != null && stockQty <= 0)
  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price

  const imgSrc = normalizeMediaUrl(thumbnailSrc) ?? thumbnailSrc

  function handleCta() {
    if (isOutOfStock) return
    if (hasVariations) {
      scrollTargetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      return
    }
    onAddToCart(product, 1)
  }

  const ctaLabel = isOutOfStock
    ? "Out of stock"
    : hasVariations
      ? "Select options"
      : "Add to cart"

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="product-sticky-bar"
          role="region"
          aria-label="Product purchase"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "fixed left-0 right-0 z-40 border-t border-border bg-background shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:z-50",
            "max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0"
          )}
        >
          <div className="max-w-4xl mx-auto px-4 lg:px-0 flex items-center gap-2 py-2.5 sm:gap-3 md:py-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted/30 sm:size-12">
              <Image
                src={imgSrc}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              {product.brand && (
                <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {product.brand}
                </p>
              )}
              <p className="truncate text-xs sm:text-sm font-semibold text-foreground">
                {product.name}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              {hasDiscount && product.originalPrice != null && (
                <span className="text-[10px] sm:text-[11px] text-muted-foreground line-through sm:text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs sm:text-lg font-bold tabular-nums text-foreground">
                {formatPrice(product.price)}
              </span>
            </div>
            <Button
              type="button"
              className="h-8 xs:h-10 shrink-0 rounded-md bg-primary px-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary-dark sm:h-11 sm:px-5 sm:text-sm"
              disabled={isOutOfStock}
              onClick={handleCta}
            >
              {ctaLabel}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
