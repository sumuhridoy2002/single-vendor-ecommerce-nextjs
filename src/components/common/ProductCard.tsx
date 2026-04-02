"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"
import { getEffectiveCampaignIdForCart } from "@/lib/campaign-window"
import { getProductReviewSummary } from "@/lib/reviews"
import { cn } from "@/lib/utils"
import { useIsInWishlist, useWishlistStore } from "@/store/wishlist-store"
import type { Product } from "@/types/product"
import { Heart, Rocket, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Rating } from "../ui/rating"

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onWishlist?: (product: Product) => void
  className?: string
}

function formatPriceSymbol(amount: number): string {
  return `৳ ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`
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
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const pendingIds = useWishlistStore((state) => state.pendingIds)
  const isInWishlist = useIsInWishlist(product.id)
  const isWishlistPending = pendingIds.includes(product.id)
  const whenLoggedIn = useWhenLoggedIn()
  const reviewSummary = getProductReviewSummary(
    product.recentReviews,
    product.reviewCount
  )

  const hasDiscount =
    product.originalPrice != null &&
    product.originalPrice > product.price
  const discountLabel =
    product.discountPercent != null
      ? `${product.discountPercent}% OFF`
      : product.badge === "sale"
        ? "Sale"
        : null

  const handleWishlistClick = () => {
    whenLoggedIn(() => {
      toggleWishlist(product.id)
        .then(() => onWishlist?.(product))
        .catch((e) => toast.error(e?.message ?? "Failed to update wishlist"))
    })
  }

  function productForAddToCart(): Product {
    const campaignId = getEffectiveCampaignIdForCart(product)
    return { ...product, campaignId }
  }

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="relative shrink-0 p-0">
        <Link href={`/product/${product?.slug}`} className="block">
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
        {/* Discount badge - top-left, tag style with lightning */}
        {discountLabel && (
          <div className="absolute left-0 top-0 flex items-center gap-0.5 rounded-tr-md rounded-br-md bg-red-500 px-2 py-1 text-xs font-bold uppercase tracking-tight text-white shadow-sm">
            <Zap className="size-3.5 shrink-0" strokeWidth={2.5} />
            <span>{discountLabel}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={isWishlistPending}
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "size-4",
              isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </button>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-2 px-3 py-2.5">
        {/* Delivery badge */}
        {product.deliveryText && (
          <div className="flex items-center gap-1 self-start rounded-md bg-slate-700 px-2 py-1 text-xs font-medium uppercase tracking-tight text-white">
            <Rocket className="size-3.5 shrink-0" />
            <span>{product.deliveryText}</span>
          </div>
        )}

        {/* Product title - bold, truncated */}
        <div className="h-8 xs:h-10">
          <Link
            href={`/product/${product?.slug}`}
            className="line-clamp-2 text-xs xs:text-sm lg:text-base font-bold leading-tight text-foreground hover:underline h-auto"
          >
            {product.name}
          </Link>
        </div>
        {/* Variant / unit line - centered with asterisks */}
        {/* {product.unit && (
          <p className="text-xs text-muted-foreground">
            {product.unit}
          </p>
        )} */}
        {/* Star rating with review count */}
        <div className="flex min-h-3 xs:min-h-5 items-center gap-1.5">
          <>
            <Rating
              rating={
                product.recentReviews != null
                  ? reviewSummary.averageRating
                  : (product.rating ?? 0)
              }
              size="sm"
            />
            {reviewSummary.reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({reviewSummary.reviewCount})
              </span>
            )}
          </>
        </div>
      </CardContent>

      <CardFooter className="shrink-0 flex items-end justify-between gap-2 border-border/50 px-3 pt-1 pb-2.5">
        <div className="flex flex-col gap-0.5 h-8 xs:h-10 items-start justify-end">
          {hasDiscount && product.originalPrice != null && (
            <span className="text-[10px] xs:text-xs text-muted-foreground line-through">
              {formatPriceSymbol(product.originalPrice)}
            </span>
          )}
          <span className="text-xs xs:text-base font-bold text-foreground">
            {formatPriceSymbol(product.price)}
          </span>
        </div>
        <Button
          size="sm"
          className="shrink-0 rounded-md border-2 border-primary bg-primary-light/20 font-bold uppercase text-primary hover:bg-primary-light hover:text-primary-dark"
          aria-label="Add to cart"
          onClick={() => onAddToCart?.(productForAddToCart())}
        >
          ADD
        </Button>
      </CardFooter>
    </Card>
  )
}

