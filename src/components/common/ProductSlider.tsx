"use client"

import type { Swiper as SwiperType } from "swiper"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { ProductCard } from "@/components/common/ProductCard"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

const DEFAULT_BREAKPOINTS = {
  640: { slidesPerView: 3, spaceBetween: 16 },
  768: { slidesPerView: 4, spaceBetween: 16 },
  1024: { slidesPerView: 5, spaceBetween: 20 },
} as const

export interface ProductSliderProps {
  products: Product[]
  spaceBetween?: number
  slidesPerView?: number
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween: number }>
  className?: string
  onSwiper?: (swiper: SwiperType) => void
  onSlideChange?: (swiper: SwiperType) => void
  onAddToCart?: (product: Product) => void
}

export function ProductSlider({
  products,
  spaceBetween = 12,
  slidesPerView = 2,
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
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
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
          <SwiperSlide key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
