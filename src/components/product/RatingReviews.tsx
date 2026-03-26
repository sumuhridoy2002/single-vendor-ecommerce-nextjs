"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { submitProductReview } from "@/lib/api/products"
import type { Product, ProductReview } from "@/types/product"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, Star } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

const STAR_COUNTS = [5, 4, 3, 2, 1] as const

export interface RatingReviewsProps {
  product: Product
  /** Callback after a review is submitted (e.g. to refetch product). */
  onReviewSubmitted?: () => Promise<void> | void
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
              ? "fill-warning text-warning"
              : i === full && hasHalf
                ? "fill-warning/50 text-warning"
                : "text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?"
}

export function RatingReviews({
  product,
  className,
}: RatingReviewsProps) {
  const { isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState<ProductReview[]>(() => product.recentReviews ?? [])
  const reviewCount = Math.max(product.reviewCount ?? 0, reviews.length)
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0
  const breakdown = STAR_COUNTS.map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.floor(r.rating) === stars).length,
  }))
  const maxCount = Math.max(...breakdown.map((b) => b.count), 1)

  const [formRating, setFormRating] = useState(0)
  const [formComment, setFormComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setReviews(product.recentReviews ?? [])
  }, [product.id, product.recentReviews])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (formRating < 1 || formRating > 5) {
        toast.error("Please select a rating (1–5 stars).")
        return
      }
      const comment = formComment.trim()
      if (!comment) {
        toast.error("Please write a comment.")
        return
      }
      setIsSubmitting(true)
      try {
        const res = await submitProductReview(product.id, {
          rating: formRating,
          comment,
        })
        const newReview: ProductReview = {
          id: res.data.id,
          rating: res.data.rating,
          comment: res.data.comment,
          user_name: res.data.user_name,
          user_avatar: res.data.user_avatar,
          created_at: res.data.created_at,
          reply: res.data.reply ?? undefined,
        }
        setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)])
        toast.success(res.message ?? "Review submitted successfully!")
        setFormRating(0)
        setFormComment("")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to submit review")
      } finally {
        setIsSubmitting(false)
      }
    },
    [product.id, formRating, formComment]
  )

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
          <div className="text-3xl font-bold text-foreground">
            {rating > 0 ? rating.toFixed(1) : "—"}/5
          </div>
          <div className="mt-1 flex justify-center">
            <RatingStars rating={rating} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviewCount} {reviewCount === 1 ? "Rating" : "Ratings"}
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
                <Star className="size-4 fill-warning text-warning" />
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-warning"
                  style={{
                    width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-muted-foreground">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review - only when logged in */}
      {isAuthenticated && (
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-lg border border-border bg-muted/30 p-4"
      >
        <h3 className="text-sm font-medium text-foreground">Write a review</h3>
        <div className="mt-3 space-y-3">
          <div>
            <Label className="text-muted-foreground">Rating</Label>
            <div className="mt-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="touch-manipulation rounded p-0.5 transition-transform hover:scale-110"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={formRating >= star}
                >
                  <Star
                    className={cn(
                      "size-8",
                      (hoverRating || formRating) >= star
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="review-comment" className="text-muted-foreground">
              Comment
            </Label>
            <Textarea
              id="review-comment"
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="mt-1 min-h-[100px] resize-y"
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit review"
            )}
          </Button>
        </div>
      </form>
      )}

      <ul className="mt-6 space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li
              key={review.id}
              className="flex gap-4 border-b border-border pb-6 last:border-0 last:pb-0"
            >
              <Avatar className="size-10 shrink-0">
                {review.user_avatar ? (
                  <AvatarImage
                    src={review.user_avatar}
                    alt={review.user_name}
                  />
                ) : null}
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {getInitials(review.user_name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">
                    {review.user_name}
                  </span>
                  <RatingStars rating={review.rating} />
                  <span className="text-xs text-muted-foreground">
                    {review.created_at}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.comment}
                </p>
                {review.reply ? (
                  <div className="mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Store reply
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {review.reply}
                    </p>
                  </div>
                ) : null}
              </div>
            </li>
          ))
        ) : (
          <li className="py-8 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first to review!
          </li>
        )}
      </ul>
    </section>
  )
}
