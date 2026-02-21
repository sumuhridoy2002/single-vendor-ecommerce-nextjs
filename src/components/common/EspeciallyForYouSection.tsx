"use client"

import { OfferCard } from "@/components/common/OfferCard"
import { useOffers } from "@/hooks/data/useOffers"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

export function EspeciallyForYouSection() {
  const { offers, isLoading, error } = useOffers()

  if (isLoading) {
    return (
      <section className="px-4 py-6 md:px-6 md:py-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground md:text-xl">
          Especially For You
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[160px] min-w-[140px] w-full animate-pulse rounded-l-xl rounded-br-xl rounded-tr-[50%] bg-muted"
            />
          ))}
        </div>
      </section>
    )
  }

  if (error || offers.length === 0) {
    return null
  }

  const breakpoints = {
    0: { slidesPerView: 2, spaceBetween: 12 },
    768: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
    1280: { slidesPerView: 4, spaceBetween: 20 },
    1536: { slidesPerView: 6, spaceBetween: 20 },
  }

  return (
    <section className="py-6 md:py-8 px-4 2xl:px-0 max-w-7xl mx-auto">
      <h2 className="mb-8 font-semibold text-foreground text-lg md:text-3xl text-center">
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
      </div>
    </section>
  )
}
