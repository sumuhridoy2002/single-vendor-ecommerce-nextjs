"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { ZoomIn } from "lucide-react"
import Image from "next/image"
import { useCallback, useMemo, useRef, useState } from "react"

const ZOOM_LEVEL = 2

export interface ProductGalleryProps {
  product: Product
  variantImage?: string
  onVariantImageChange?: (image?: string) => void
  className?: string
}

export function ProductGallery({
  product,
  variantImage,
  onVariantImageChange,
  className,
}: ProductGalleryProps) {
  const variationImageSet = useMemo(() => {
    const set = new Set<string>()
    for (const variation of product.variations ?? []) {
      if (variation.image) set.add(variation.image)
    }
    return set
  }, [product.variations])

  const images = useMemo(() => {
    const baseImages = product.images?.length ? product.images : [product.image]
    const variationImages =
      product.variations
        ?.map((variation) => variation.image)
        .filter((image): image is string => Boolean(image)) ?? []

    return Array.from(new Set([...baseImages, ...variationImages]))
  }, [product.images, product.image, product.variations])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const variantIndex = useMemo(
    () => (variantImage ? images.indexOf(variantImage) : -1),
    [variantImage, images]
  )
  const activeIndex = variantIndex >= 0 ? variantIndex : selectedIndex
  const selectedImage = useMemo(
    () => images[activeIndex] ?? product.image,
    [images, activeIndex, product.image]
  )
  const isZoomed = zoomOrigin !== null
  const discountPercent =
    product.discountPercent ??
    (product.originalPrice
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : null)

  const handleMouseEnter = useCallback(() => {
    setZoomOrigin({ x: 50, y: 50 })
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setZoomOrigin({ x, y })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setZoomOrigin(null)
  }, [])

  return (
    <div className={cn("w-full flex flex-col sm:flex-row-reverse md:flex-col lg:flex-row-reverse gap-4", className)}>
      {/* Main image with hover zoom */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden rounded-lg border bg-muted/20 cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AspectRatio ratio={1}>
          <div className="relative size-full">
            {product.badge === "sale" && (
              <Badge
                variant="destructive"
                className="absolute left-3 top-3 z-10 shadow-sm"
              >
                {discountPercent != null ? `${discountPercent}% OFF` : "Sale"}
              </Badge>
            )}
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={cn(
                "object-contain transition-transform duration-150 ease-out",
                isZoomed && "select-none pointer-events-none"
              )}
              style={
                isZoomed && zoomOrigin
                  ? {
                    transform: `scale(${ZOOM_LEVEL})`,
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }
                  : undefined
              }
            />
          </div>
        </AspectRatio>
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 left-3 gap-1.5 rounded-md shadow-sm pointer-events-none"
          aria-label="Quick look"
        >
          <ZoomIn className="size-4" />
          Quick Look
        </Button>
      </div>

      {/* Thumbnails: vertical on desktop, horizontal on mobile */}
      {images.length > 1 && (
        <div className="scrollbar max-h-[530px] flex flex-row sm:flex-col md:flex-row lg:flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSelectedIndex(i)
                // If the user is clicking thumbnails, also sync the "variant image"
                // so the main image + active thumbnail stay consistent.
                if (onVariantImageChange) {
                  onVariantImageChange(variationImageSet.has(src) ? src : undefined)
                }
              }}
              className={cn(
                "relative size-16 xl:size-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                activeIndex === i
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
