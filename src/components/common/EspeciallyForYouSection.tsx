"use client"

import { OfferCard } from "@/components/common/OfferCard"
import { useOffers } from "@/hooks/data/useOffers"

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

  return (
    <section className="py-6 md:py-8 px-4 2xl:px-0 max-w-7xl mx-auto">
      <h2 className="mb-8 font-semibold text-foreground text-lg md:text-3xl text-center">
        Especially For You
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  )
}
