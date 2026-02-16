"use client"

import Image from "next/image"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const BANNER_IMAGES = [
  "/assets/images/banner/banner-1.webp",
  "/assets/images/banner/banner-2.webp",
  "/assets/images/banner/banner-3.webp",
  "/assets/images/banner/banner-4.webp",
  "/assets/images/banner/banner-5.webp",
  "/assets/images/banner/banner-6.webp",
  "/assets/images/banner/banner-7.webp",
  "/assets/images/banner/banner-8.webp",
  "/assets/images/banner/banner-9.webp",
  "/assets/images/banner/banner-10.webp",
]

export function HeroBannerSlider() {
  return (
    <section className="hero-banner-slider w-full min-w-0 overflow-hidden px-4 py-4 md:px-6 md:py-6">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "hero-banner-bullet",
          bulletActiveClass: "hero-banner-bullet-active",
        }}
        className="hero-banner-swiper h-full w-full rounded-lg overflow-hidden"
        speed={600}
      >
        {BANNER_IMAGES.map((src, index) => (
          <SwiperSlide key={src}>
            <div className="relative aspect-1920/600 w-full min-h-[200px] sm:min-h-[280px] md:min-h-[360px]">
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
