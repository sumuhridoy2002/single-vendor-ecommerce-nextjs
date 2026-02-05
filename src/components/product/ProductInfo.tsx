"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export interface ProductInfoProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onWishlist?: (product: Product) => void
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
                ? "fill-amber-400 text-amber-400"
                : i === full && hasHalf
                  ? "fill-amber-400/50 text-amber-400"
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
  onWishlist,
  className,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
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

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div>
        {product.badge === "sale" && (
          <Badge variant="destructive" className="mb-2">
            {discountPercent != null ? `${discountPercent}% OFF` : "Sale"}
          </Badge>
        )}
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
              <Badge variant="secondary">{discountPercent}% OFF</Badge>
            )}
          </>
        )}
      </div>

      {product.unit && (
        <p className="text-sm text-muted-foreground">
          {quantity} x {product.unit}
        </p>
      )}

      {inStock && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
          <span className="size-2 rounded-full bg-green-500" aria-hidden />
          In Stock
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            className="h-9 w-14 border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Quantity"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="size-4" />
          Add To Cart
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => onWishlist?.(product)}
        >
          <Heart className="size-4" />
          Add to Wishlist
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
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Share">
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
