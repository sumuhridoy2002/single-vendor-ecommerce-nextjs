"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { ZoomIn } from "lucide-react"
import { useState } from "react"

export interface ProductGalleryProps {
  product: Product
  className?: string
}

export function ProductGallery({ product, className }: ProductGalleryProps) {
  const images = product.images?.length ? product.images : [product.image]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const mainImage = images[selectedIndex] ?? product.image

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg border bg-muted/30">
        <AspectRatio ratio={1}>
          <img
            src={mainImage}
            alt={product.name}
            className="size-full object-contain"
          />
        </AspectRatio>
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 left-3 gap-1.5 rounded-md shadow-sm"
          aria-label="Quick look"
        >
          <ZoomIn className="size-4" />
          Quick Look
        </Button>
      </div>

      {/* Thumbnails: vertical on desktop, horizontal on mobile */}
      {images.length > 1 && (
        <div className="flex gap-2">
          <div className="flex flex-1 flex-row gap-2 overflow-x-auto lg:flex-col lg:max-w-[72px]">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors lg:h-14 lg:w-14",
                  selectedIndex === i
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <img
                  src={src}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
