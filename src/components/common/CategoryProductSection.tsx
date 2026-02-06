"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import type { Swiper as SwiperType } from "swiper"

import { ProductSlider } from "@/components/common/ProductSlider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

export interface CategoryProductSectionProps {
  title: string
  products: Product[]
  viewAllHref?: string
  className?: string
  sectionBgClassName?: string
  onAddToCart?: (product: Product) => void
}

export function CategoryProductSection({
  title,
  products,
  viewAllHref,
  className,
  sectionBgClassName,
  onAddToCart,
}: CategoryProductSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  if (products.length === 0) return null

  return (
    <section
      className={cn(
        "min-w-0 px-4 py-6 md:px-6 md:py-8",
        sectionBgClassName,
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          {title}
        </h2>
        <div className="flex items-center gap-1">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          )}
          <div className="flex items-center gap-0.5">
            <Button
              variant="outline"
              size="icon-sm"
              className="size-8 rounded-full"
              aria-label="Previous products"
              disabled={isBeginning}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="size-8 rounded-full"
              aria-label="Next products"
              disabled={isEnd}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <ProductSlider
        products={products}
        onAddToCart={onAddToCart}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          setIsBeginning(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }}
      />
    </section>
  )
}
