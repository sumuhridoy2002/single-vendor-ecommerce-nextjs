"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { BsTwitterX } from "react-icons/bs"
import {
  FaFacebook,
  FaLinkedin,
  FaShareAlt,
  FaTelegram
} from "react-icons/fa"



export interface ProductInfoProps {
  product: Product
  onAddToCart?: (
    product: Product,
    quantity?: number,
    options?: { variationId?: number }
  ) => void
  onVariantImageChange?: (image?: string) => void
  className?: string
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount)
}

function RatingStars({
  rating,
  reviewCount,
  linkToReviews,
}: {
  rating: number
  reviewCount?: number
  linkToReviews?: boolean
}) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const content = (
    <>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < full
                ? "fill-warning text-warning"
                : i === full && hasHalf
                  ? "fill-warning/50 text-warning"
                  : "text-muted-foreground/40"
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating}/5 {reviewCount != null && `(${reviewCount} Ratings)`}
      </span>
    </>
  )
  if (linkToReviews) {
    return (
      <a
        href="#reviews"
        className="flex items-center gap-2 text-foreground hover:underline"
      >
        {content}
        <ChevronRight className="size-4 text-muted-foreground" />
      </a>
    )
  }
  return <div className="flex items-center gap-2">{content}</div>
}

export function ProductInfo({
  product,
  onAddToCart,
  onVariantImageChange,
  className,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedByType, setSelectedByType] = useState<Record<string, number>>(
    () => {
      const v = product.variations
      if (!v?.length) return {}
      const initial: Record<string, number> = {}
      for (const variation of v) {
        if (initial[variation.type] == null) {
          initial[variation.type] = variation.id
        }
      }
      return initial
    }
  )

  const variationsByType = useMemo(() => {
    const v = product.variations
    if (!v?.length) return []
    const byType = new Map<
      string,
      { id: number; type: string; value: string; image?: string }[]
    >()
    for (const item of v) {
      const list = byType.get(item.type) ?? []
      list.push(item)
      byType.set(item.type, list)
    }
    return Array.from(byType.entries()).map(([type, list]) => ({ type, list }))
  }, [product.variations])

  const selectedVariationId = useMemo(() => {
    const ids = Object.values(selectedByType).filter(Boolean)
    return ids[0] ?? undefined
  }, [selectedByType])

  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price
  const discountPercent =
    product.discountPercent ??
    (product.originalPrice
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : null)
  const inStock = product.inStock ?? true
  const stockQty = product.stockQty
  const isOutOfStock = !inStock || (stockQty != null && stockQty <= 0)
  const maxQuantity = stockQty != null && stockQty > 0 ? stockQty : undefined

  const getShareUrl = () =>
    typeof window !== "undefined" ? window.location.href : ""
  const getShareText = () => `Check out ${product.name}`

  function openShareLink(shareUrl: string) {
    if (typeof window === "undefined") return
    // Using a new tab/window avoids blocking the user if popups are allowed.
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  async function handleShare() {
    const url = getShareUrl()
    const shareData: ShareData = {
      title: product.name,
      text: getShareText(),
      url,
    }
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(url)
        }
      }
    } else {
      await copyToClipboard(url)
    }
  }

  function handleFacebookShare() {
    const url = getShareUrl()
    if (!url) return
    openShareLink(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`
    )
  }

  function handleTwitterShare() {
    const url = getShareUrl()
    if (!url) return
    openShareLink(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(getShareText())}`
    )
  }

  function handleLinkedInShare() {
    const url = getShareUrl()
    if (!url) return
    openShareLink(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`
    )
  }

  function handleTelegramShare() {
    const url = getShareUrl()
    if (!url) return
    openShareLink(
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(getShareText())}`
    )
  }

  async function copyToClipboard(text: string) {
    if (typeof navigator?.clipboard?.writeText === "function") {
      await navigator.clipboard.writeText(text)
    }
  }

  const clampQuantity = (nextQuantity: number) => {
    const safeQuantity = Math.max(1, nextQuantity)
    if (maxQuantity == null) return safeQuantity
    return Math.min(maxQuantity, safeQuantity)
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div>
        <h1 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">
          {product.name}
        </h1>
        {product.rating != null && (
          <div className="mt-2">
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              linkToReviews
            />
          </div>
        )}
        {product.brand && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Brand:</span>
            {product.brandHref ? (
              <Link
                href={product.brandHref}
                className="flex items-center gap-1 font-medium text-foreground hover:underline"
              >
                {product.brand}
                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span className="font-medium text-foreground">{product.brand}</span>
            )}
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>Sold: {product.soldOutQty ?? 0}</span>
          {stockQty != null && <span>Available: {stockQty}</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground md:text-3xl">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && product.originalPrice != null && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
            {discountPercent != null && (
              <Badge variant="destructive">{discountPercent}% OFF</Badge>
            )}
          </>
        )}
      </div>

      {product.unit && (
        <p className="text-sm text-muted-foreground">
          {quantity} x {product.unit}
        </p>
      )}

      <div
        className={cn(
          "flex items-center gap-2 text-sm",
          isOutOfStock ? "text-destructive" : "text-success"
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full",
            isOutOfStock ? "bg-destructive" : "bg-success"
          )}
          aria-hidden
        />
        {isOutOfStock ? "Out of Stock" : "In Stock"}
      </div>

      {variationsByType.length > 0 && (
        <div className="space-y-4">
          {variationsByType.map(({ type, list }) => (
            <div key={type} className="space-y-2">
              <span className="text-sm font-medium text-foreground">
                {type}:
              </span>
              <div className="flex flex-wrap gap-2">
                {list.map((variation) => {
                  const selected = selectedByType[type] === variation.id
                  return (
                    <button
                      key={variation.id}
                      type="button"
                      onClick={() => {
                        setSelectedByType((prev) => ({
                          ...prev,
                          [type]: variation.id,
                        }))
                        onVariantImageChange?.(variation.image)
                      }
                      }
                      className={cn(
                        "rounded-md border px-4 py-2 text-xs font-medium transition-colors",
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-input bg-background text-foreground hover:border-foreground/50"
                      )}
                      aria-pressed={selected}
                      aria-label={`${type} ${variation.value}`}
                    >
                      {variation.value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setQuantity((q) => clampQuantity(q - 1))}
            aria-label="Decrease quantity"
            disabled={isOutOfStock}
          >
            <Minus className="size-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) =>
              setQuantity(clampQuantity(parseInt(e.target.value, 10) || 1))
            }
            className="h-9 w-14 border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Quantity"
            disabled={isOutOfStock}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setQuantity((q) => clampQuantity(q + 1))}
            aria-label="Increase quantity"
            disabled={isOutOfStock || (maxQuantity != null && quantity >= maxQuantity)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-row">
        <Button
          className="flex-1 gap-2 bg-primary hover:bg-primary-dark"
          disabled={isOutOfStock}
          onClick={() =>
            onAddToCart?.(product, quantity, {
              variationId: selectedVariationId,
            })
          }
        >
          <ShoppingCart className="size-4" />
          {isOutOfStock ? "Out of Stock" : "Add To Cart"}
        </Button>
      </div>

      {product.deliveryText && (
        <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-800 dark:bg-sky-950/20">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="size-5 text-sky-600 dark:text-sky-400" />
            <span>
              Free Shipping for orders over ৳500. Delivers in {product.deliveryText}.
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 border-t pt-4">
        <span className="text-sm text-muted-foreground">Share:</span>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Share on Facebook"
            onClick={handleFacebookShare}
          >
            <FaFacebook className="size-5 text-gray-600" />
            <span className="sr-only">Facebook</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Share on Twitter"
            onClick={handleTwitterShare}
          >
            <BsTwitterX className="size-5 text-gray-600" />
            <span className="sr-only">Twitter</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Share on LinkedIn"
            onClick={handleLinkedInShare}
          >
            <FaLinkedin className="size-5 text-gray-600" />
            <span className="sr-only">LinkedIn</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Share on Telegram"
            onClick={handleTelegramShare}
          >
            <FaTelegram className="size-5 text-gray-600" />
            <span className="sr-only">Telegram</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Global share"
            onClick={handleShare}
          >
            <FaShareAlt className="size-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
