"use client"

import Link from "next/link"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { ProductCard } from "@/components/common/ProductCard"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

export interface CategoryProductSectionProps {
  title: string
  products: Product[]
  viewAllHref?: string
  className?: string
  sectionBgClassName?: string
}

export function CategoryProductSection({
  title,
  products,
  viewAllHref,
  className,
  sectionBgClassName,
}: CategoryProductSectionProps) {
  if (products.length === 0) return null

  return (
    <section
      className={cn(
        "min-w-0 rounded-xl px-4 py-6 md:px-6 md:py-8",
        sectionBgClassName,
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        )}
      </div>
      <div
        className="min-w-0 w-full overflow-hidden"
        style={{ width: "100%", minWidth: 0, maxWidth: "100%" }}
      >
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={12}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="category-products-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
