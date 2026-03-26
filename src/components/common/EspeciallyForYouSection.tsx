"use client"

import { useBrands } from "@/hooks/data/useBrands"
import { useOffers } from "@/hooks/data/useOffers"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

export function EspeciallyForYouSection() {
  const { offers, isLoading, error } = useOffers()
  const { brands, isLoading: brandsLoading } = useBrands()

  if (isLoading) {
    return (
      <section className="px-4 py-6 md:px-6 md:py-8">
        {/* <h2 className="mb-4 text-lg font-semibold text-foreground md:text-xl">
          Especially For You
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[160px] min-w-[140px] w-full animate-pulse rounded-l-xl rounded-br-xl rounded-tr-[50%] bg-muted"
            />
          ))}
        </div> */}
      </section>
    )
  }

  if (error || offers.length === 0) {
    return null
  }

  const breakpoints = {
    0: { slidesPerView: 2.2, spaceBetween: 12 },
    768: { slidesPerView: 2.5, spaceBetween: 16 },
    1024: { slidesPerView: 3.5, spaceBetween: 20 },
    1280: { slidesPerView: 4.8, spaceBetween: 20 },
    1536: { slidesPerView: 6, spaceBetween: 20 },
  }

  return (
    <section className="py-3 xs:py-6 md:py-8 px-4 2xl:px-0 max-w-7xl mx-auto">
      {/* <h2 className="mb-8 font-semibold text-foreground text-lg md:text-3xl text-center">
        Especially For You
      </h2>
      <div className="min-w-0 w-full overflow-hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={breakpoints}
          className="especially-for-you-swiper"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              <OfferCard offer={offer} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div> */}
      {!brandsLoading && brands.length > 0 && (
        <>
          <h2 className="mb-2 xs:mb-4 md:mb-8 font-semibold text-foreground text-lg md:text-3xl text-center">
            Shop by Brand
          </h2>
          <div className="min-w-0 w-full overflow-hidden">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={breakpoints}
              className="brands-swiper"
            >
              {brands.map((brand) => (
                <SwiperSlide key={brand.slug}>
                  <Link
                    href={`/brand/${brand.slug}`}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                  >
                    {brand.image ? (
                      <div className="relative h-16 w-24 shrink-0">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          sizes="96px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded bg-muted text-lg font-semibold text-muted-foreground">
                        {brand.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-center text-sm font-medium text-foreground line-clamp-2">
                      {brand.name}
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </section>
  )
}
