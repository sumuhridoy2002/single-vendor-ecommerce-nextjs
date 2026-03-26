"use client"

import { useCampaigns } from "@/hooks/data/useCampaigns"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

export function CampaignsSection() {
  const { campaigns, isLoading, error } = useCampaigns()

  if (isLoading) {
    return (
      <section className="container py-3 xs:py-6 md:py-8">
        <div className="mb-4 h-8 w-44 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-[160px] animate-pulse rounded-lg bg-muted" />
          <div className="hidden h-[160px] animate-pulse rounded-lg bg-muted sm:block" />
        </div>
      </section>
    )
  }

  if (error || campaigns.length === 0) {
    return null
  }

  const breakpoints = {
    0: { slidesPerView: 1.1, spaceBetween: 12 },
    768: { slidesPerView: 1.6, spaceBetween: 16 },
    1024: { slidesPerView: 2.1, spaceBetween: 20 },
  }

  return (
    <section className="container py-3 xs:py-6 md:py-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground md:text-xl">
        Campaigns
      </h2>
      <div className="min-w-0 w-full overflow-hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={breakpoints}
          className="campaigns-swiper"
        >
          {campaigns.map((campaign) => (
            <SwiperSlide key={campaign.id}>
              <Link
                href={`/campaign/${campaign.id}`}
                className="group block overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-16/6 w-full">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-foreground md:text-base">
                    {campaign.title}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
