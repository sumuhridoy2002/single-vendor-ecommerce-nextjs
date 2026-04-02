"use client"

import type { Swiper as SwiperType } from "swiper"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { ProductCard } from "@/components/common/ProductCard"
import { cn } from "@/lib/utils"
import type { AddToCartOptions, Product } from "@/types/product"

/** spaceBetween only — use with slidesPerView: "auto" and explicit slide widths */
const DEFAULT_BREAKPOINTS = {
  430: { spaceBetween: 10 },
  620: { spaceBetween: 10 },
  768: { spaceBetween: 16 },
  1024: { spaceBetween: 16 },
  1180: { spaceBetween: 16 },
  1441: { spaceBetween: 20 },
} as const

/**
 * Swiper’s default `.swiper-slide { width: 100% }` makes one slide = full viewport.
 * Use important widths so they override swiper.css when slidesPerView is "auto".
 */
const SLIDE_WIDTH_CLASS =
  "w-[140px]! shrink-0 sm:w-[160px]! md:w-[180px]! lg:w-[200px]! xl:w-[220px]! 2xl:w-[240px]!"

export interface ProductSliderProps {
  products: Product[]
  spaceBetween?: number
  breakpoints?: Record<number, { spaceBetween: number }>
  className?: string
  onSwiper?: (swiper: SwiperType) => void
  onSlideChange?: (swiper: SwiperType) => void
  onAddToCart?: (product: Product, options?: AddToCartOptions) => void
}

export function ProductSlider({
  products,
  spaceBetween = 8,
  breakpoints = DEFAULT_BREAKPOINTS,
  className,
  onSwiper,
  onSlideChange,
  onAddToCart,
}: ProductSliderProps) {
  if (products.length === 0) return null

  return (
    <div
      className={cn("min-w-0 w-full overflow-hidden", className)}
      style={{ width: "100%", minWidth: 0, maxWidth: "100%" }}
    >
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        onSwiper={(swiper) => {
          onSwiper?.(swiper)
        }}
        onSlideChange={(swiper) => {
          onSlideChange?.(swiper)
        }}
        className="category-products-swiper"
      >
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            className={cn("h-auto! overflow-hidden", SLIDE_WIDTH_CLASS)}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              className="h-full min-w-0 w-full max-w-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
