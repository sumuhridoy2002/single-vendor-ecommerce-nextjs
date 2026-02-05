"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onWishlist?: (product: Product) => void
  className?: string
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function RatingStars({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              i < full
                ? "fill-amber-400 text-amber-400"
                : i === full && hasHalf
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-muted-foreground/40"
            )}
          />
        ))}
      </div>
      {reviewCount != null && (
        <span className="text-xs">({reviewCount})</span>
      )}
    </div>
  )
}

const PLACEHOLDER_IMAGE = "/assets/images/placeholder-image.png"

export function ProductCard({
  product,
  onAddToCart,
  onWishlist,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const imageSrc = imageError ? PLACEHOLDER_IMAGE : product.image

  const hasDiscount =
    product.originalPrice != null &&
    product.originalPrice > product.price
  const discountLabel =
    product.discountPercent != null
      ? `${product.discountPercent}% OFF`
      : product.badge === "sale"
        ? "Sale"
        : null

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="relative p-0">
        <Link href={`/product/${product.slug}`} className="block">
          <AspectRatio ratio={1}>
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="size-full object-cover"
              onError={() => setImageError(true)}
            />
          </AspectRatio>
        </Link>
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.badge && product.badge !== "sale" && (
            <Badge variant="secondary" className="text-xs capitalize">
              {product.badge}
            </Badge>
          )}
        </div>
        {discountLabel && (
          <div className="absolute right-2 top-2">
            <Badge variant="destructive" className="text-xs">
              {discountLabel}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 px-4 py-3">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-tight text-foreground hover:underline"
        >
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.originalPrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.rating != null && (
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 border-t px-4 py-3">
        {product.unit && (
          <span className="text-xs text-muted-foreground">{product.unit}</span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Add to wishlist"
            onClick={() => onWishlist?.(product)}
          >
            <Heart className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Add to cart"
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
