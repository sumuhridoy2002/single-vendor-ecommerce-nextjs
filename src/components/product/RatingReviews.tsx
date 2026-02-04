"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { Camera, Filter, Star } from "lucide-react"

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  hasPhoto?: boolean
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Priya S.",
    rating: 5,
    text: "Great product, exactly as described. Fast delivery and good packaging.",
    date: "3 days ago",
    hasPhoto: true,
  },
  {
    id: "2",
    author: "Rahul M.",
    rating: 4,
    text: "Good value for money. Would buy again.",
    date: "1 week ago",
  },
  {
    id: "3",
    author: "Anita K.",
    rating: 5,
    text: "Very satisfied with the quality. Recommended.",
    date: "2 weeks ago",
  },
]

const STAR_COUNTS = [5, 4, 3, 2, 1] as const

export interface RatingReviewsProps {
  product: Product
  reviews?: Review[]
  className?: string
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && hasHalf
                ? "fill-amber-400/50 text-amber-400"
                : "text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  )
}

export function RatingReviews({
  product,
  reviews = MOCK_REVIEWS,
  className,
}: RatingReviewsProps) {
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? reviews.length
  const breakdown = STAR_COUNTS.map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.floor(r.rating) === stars).length,
  }))
  const maxCount = Math.max(...breakdown.map((b) => b.count), 1)

  return (
    <section
      id="reviews"
      className={cn("scroll-mt-20 rounded-xl border bg-card p-6", className)}
    >
      <h2 className="text-lg font-semibold text-foreground md:text-xl">
        Rating & Reviews
      </h2>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="shrink-0 text-center">
          <div className="text-3xl font-bold text-foreground">{rating}/5</div>
          <div className="mt-1 flex justify-center">
            <RatingStars rating={rating} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviewCount} Ratings
          </p>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {breakdown.map(({ stars, count }) => (
            <div
              key={stars}
              className="flex items-center gap-3 text-sm"
            >
              <div className="flex w-16 shrink-0 items-center gap-0.5">
                <span className="text-muted-foreground">{stars}</span>
                <Star className="size-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-muted-foreground">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="size-4" />
          Clear
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Camera className="size-4" />
          Photos
        </Button>
        {STAR_COUNTS.map((s) => (
          <Button key={s} variant="outline" size="sm" className="gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {s}
          </Button>
        ))}
        <Badge variant="secondary">Default</Badge>
      </div>

      <ul className="mt-6 space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li
              key={review.id}
              className="flex gap-4 border-b border-border pb-6 last:border-0 last:pb-0"
            >
              <Avatar className="size-10 shrink-0">
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {review.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">
                    {review.author}
                  </span>
                  <RatingStars rating={review.rating} />
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.text}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="py-8 text-center text-sm text-muted-foreground">
            No reviews found
          </li>
        )}
      </ul>
    </section>
  )
}
