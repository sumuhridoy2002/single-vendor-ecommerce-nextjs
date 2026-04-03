"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"
import { getEffectiveCampaignIdForCart } from "@/lib/campaign-window"
import { getProductReviewSummary } from "@/lib/reviews"
import { cn } from "@/lib/utils"
import { useIsInWishlist, useWishlistStore } from "@/store/wishlist-store"
import type { AddToCartOptions, Product } from "@/types/product"
import { Heart, Rocket, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { memo, useMemo, useState } from "react"
import { toast } from "sonner"
import { Rating } from "../ui/rating"

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, options?: AddToCartOptions) => void
  onWishlist?: (product: Product) => void
  className?: string
}

function formatPriceSymbol(amount: number): string {
  return `৳ ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`
}

const PLACEHOLDER_IMAGE = "/assets/images/placeholder-image.png"

function ProductCardInner({
  product,
  onAddToCart,
  onWishlist,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [variantPopoverOpen, setVariantPopoverOpen] = useState(false)
  const imageSrc = imageError ? PLACEHOLDER_IMAGE : product.image
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const pendingIds = useWishlistStore((state) => state.pendingIds)
  const isInWishlist = useIsInWishlist(product.id)
  const isWishlistPending = pendingIds.includes(product.id)
  const whenLoggedIn = useWhenLoggedIn()
  const reviewSummary = useMemo(
    () => getProductReviewSummary(product.recentReviews, product.reviewCount),
    [product.recentReviews, product.reviewCount]
  )

  const variationRows = useMemo(() => product.variations ?? [], [product.variations])

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

  function productForAddToCart(p: Product): Product {
    const campaignId = getEffectiveCampaignIdForCart(p)
    return { ...p, campaignId }
  }

  const hasVariants = variationRows.length > 0

  function handleVariantPopoverOpenChange(open: boolean) {
    setVariantPopoverOpen(open)
  }

  function addVariationToCart(variationId: number) {
    whenLoggedIn(() => {
      onAddToCart?.(productForAddToCart(product), { variationId: variationId })
      setVariantPopoverOpen(false)
    })
  }

  function handleAddNoVariants() {
    whenLoggedIn(() => {
      onAddToCart?.(productForAddToCart(product))
    })
  }

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border-0 md:border bg-transparent md:bg-white transition-shadow md:hover:shadow-md min-w-[140px]",
        className
      )}
    >
      <CardHeader className="relative shrink-0 p-0">
        <Link href={`/product/${product?.slug}`} className="block">
          <AspectRatio ratio={1} className="border md:border-0 rounded-b-lg overflow-hidden md:overflow-visible md:rounded-b-none">
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

      <CardContent className="flex min-h-0 flex-1 flex-col gap-1.5 md:gap-2 px-3 py-2.5">
        {/* Delivery badge */}
        {product.deliveryText && (
          <div className="flex items-center gap-1 self-start rounded-md bg-slate-700 px-2 py-1 text-xs font-medium uppercase tracking-tight text-white">
            <Rocket className="size-3.5 shrink-0" />
            <span>{product.deliveryText}</span>
          </div>
        )}

        {/* Product title - bold, truncated */}
        <div className="h-8 md:h-10">
          <Link
            href={`/product/${product?.slug}`}
            className="line-clamp-2 text-xs md:text-sm lg:text-base font-bold leading-tight text-foreground hover:underline h-auto"
          >
            {product.name}
          </Link>
        </div>
        {/* Star rating with review count */}
        <div className="flex min-h-3 md:min-h-5 items-center gap-1.5">
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

      <CardFooter className="shrink-0 flex items-end justify-between gap-2 border-border/50 px-3 pt-0.5 md:pt-1 pb-2.5">
        <div className="flex flex-col gap-0.5 h-8 md:h-10 items-start justify-end">
          {hasDiscount && product.originalPrice != null && (
            <span className="text-[10px] md:text-xs text-muted-foreground line-through">
              {formatPriceSymbol(product.originalPrice)}
            </span>
          )}
          <span className="text-xs md:text-base font-bold text-foreground">
            {formatPriceSymbol(product.price)}
          </span>
        </div>
        {hasVariants ? (
          <Popover
            open={variantPopoverOpen}
            onOpenChange={handleVariantPopoverOpenChange}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="sm"
                className="h-auto min-h-8 max-w-[min(100%,9rem)] shrink-0 whitespace-normal rounded-md border-2 border-primary bg-primary-light/20 px-2 py-1 text-[10px] font-bold uppercase leading-tight text-primary hover:bg-primary-light hover:text-primary-dark xs:max-w-none xs:text-xs"
                aria-label="Add to cart — choose a variant"
                aria-expanded={variantPopoverOpen}
                aria-haspopup="dialog"
              >
                ADD
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-[min(100vw-2rem,20rem)] p-2"
            >
              <ul
                className="max-h-64 overflow-y-auto overscroll-contain divide-y scrollbar"
                aria-label="Product variants"
              >
                {variationRows.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      className="flex w-full py-1 items-center gap-2 rounded-md border border-transparent text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => addVariationToCart(row.id)}
                    >
                      {row.image ? (
                        <span className="relative size-10 shrink-0 overflow-hidden rounded border bg-muted">
                          <Image
                            src={row.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="text-muted-foreground text-xs">
                          {row.type}
                        </span>
                        <span className="block font-medium text-foreground">
                          {row.value}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-auto min-h-8 max-w-[min(100%,9rem)] shrink-0 whitespace-normal rounded-md border-2 border-primary bg-primary-light/20 px-2 py-1 text-[10px] font-bold uppercase leading-tight text-primary hover:bg-primary-light hover:text-primary-dark xs:max-w-none xs:text-xs"
            aria-label="Add to cart"
            onClick={handleAddNoVariants}
          >
            ADD
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export const ProductCard = memo(ProductCardInner)
