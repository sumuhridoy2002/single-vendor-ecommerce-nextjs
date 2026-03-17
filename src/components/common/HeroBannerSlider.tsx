"use client"

import Image from "next/image"
import Link from "next/link"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { useHeroSliders } from "@/hooks/data/useHeroSliders"
import { cn } from "@/lib/utils"

function getLinkProps(href: string): { href: string; external: boolean } {
  if (href.startsWith("/")) return { href, external: false }
  try {
    const url = new URL(href)
    const external =
      typeof window !== "undefined" && url.origin !== window.location.origin
    return { href: external ? href : url.pathname + url.search, external }
  } catch {
    return { href, external: true }
  }
}

export function HeroBannerSlider() {
  const { heroSliders, isLoading, error } = useHeroSliders()

  if (error) {
    return (
      <section className="hero-banner-slider w-full min-w-0 overflow-hidden container pb-0 xs:pb-4 md:pb-6">
        <div className="flex aspect-1920/600 min-h-[200px] items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
          Failed to load banners
        </div>
      </section>
    )
  }

  if (isLoading || heroSliders.length === 0) {
    return (
      <section className="hero-banner-slider w-full min-w-0 overflow-hidden container pb-0 xs:pb-4 md:pb-6">
        <div
          className={cn(
            "rounded-lg overflow-hidden",
            "aspect-1920/600 w-full min-h-[200px] sm:min-h-[280px] md:min-h-[360px]",
            "bg-muted animate-pulse"
          )}
        />
      </section>
    )
  }

  return (
    <section className="hero-banner-slider w-full min-w-0 overflow-hidden container pb-0 xs:pb-4 md:pb-6">
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
        {heroSliders.map((slide) => {
          const content = (
            <div className="relative aspect-1920/600 w-full min-h-[200px] sm:min-h-[280px] md:min-h-[360px]">
              <Image
                src={slide.image}
                alt={slide.title || `Banner ${slide.serial}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={slide.serial === 1}
              />
              {(slide.title || slide.sub_title) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-6">
                  {slide.title && (
                    <p className="text-lg font-semibold text-white md:text-xl">
                      {slide.title}
                    </p>
                  )}
                  {slide.sub_title && (
                    <p className="text-sm text-white/90 md:text-base">
                      {slide.sub_title}
                    </p>
                  )}
                </div>
              )}
            </div>
          )

          const { href: linkHref, external } = getLinkProps(slide.link)

          return (
            <SwiperSlide key={slide.id}>
              {slide.link ? (
                !external ? (
                  <Link href={linkHref} className="block">
                    {content}
                  </Link>
                ) : (
                  <a
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                )
              ) : (
                content
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
