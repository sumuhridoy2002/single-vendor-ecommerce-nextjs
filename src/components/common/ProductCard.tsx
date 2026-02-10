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
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Rating } from "../ui/rating"

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onWishlist?: (product: Product) => void
  className?: string
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount)
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
        "flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="relative shrink-0 p-0">
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
      <CardContent className="flex min-h-0 flex-1 flex-col gap-1.5 px-4 py-3">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-tight text-foreground hover:underline"
        >
          {product.name}
        </Link>
        <div className="min-h-5">
          {product.unit ? (
            <span className="text-xs text-muted-foreground">{product.unit}</span>
          ) : (
            <span className="invisible text-xs">&#8203;</span>
          )}
        </div>
        <div className="flex min-h-5 items-center gap-2">
          {product.rating != null ? (
            <>
              <Rating rating={product.rating} size="sm" />
              {product.reviewCount != null && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </>
          ) : (
            <span className="invisible text-xs">&#8203;</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="shrink-0 flex items-center justify-between gap-2 border-t px-4 py-3">
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
