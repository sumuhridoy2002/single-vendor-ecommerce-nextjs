"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { normalizeMediaUrl } from "@/lib/api/client"
import { submitProductReview } from "@/lib/api/products"
import { cn } from "@/lib/utils"
import type { Product, ProductReview } from "@/types/product"
import { ImagePlus, Loader2, Star, X } from "lucide-react"
import Image from "next/image"
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
  const [reviewImage, setReviewImage] = useState<File | null>(null)
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (reviewImagePreview) URL.revokeObjectURL(reviewImagePreview)
    }
  }, [reviewImagePreview])

  useEffect(() => {
    setReviews(product.recentReviews ?? [])
  }, [product.id, product.recentReviews])

  const handleReviewImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (reviewImagePreview) URL.revokeObjectURL(reviewImagePreview)
      if (!file) {
        setReviewImage(null)
        setReviewImagePreview(null)
        e.target.value = ""
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file.")
        e.target.value = ""
        return
      }
      setReviewImage(file)
      setReviewImagePreview(URL.createObjectURL(file))
    },
    [reviewImagePreview]
  )

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
          image: reviewImage,
        })
        const imageUrl = res.data.image
          ? (normalizeMediaUrl(res.data.image) ?? res.data.image)
          : undefined
        const newReview: ProductReview = {
          id: res.data.id,
          rating: res.data.rating,
          comment: res.data.comment,
          user_name: res.data.user_name,
          user_avatar: res.data.user_avatar,
          created_at: res.data.created_at,
          image: imageUrl,
          reply: res.data.reply ?? undefined,
        }
        setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)])
        toast.success(res.message ?? "Review submitted successfully!")
        setFormRating(0)
        setFormComment("")
        if (reviewImagePreview) URL.revokeObjectURL(reviewImagePreview)
        setReviewImage(null)
        setReviewImagePreview(null)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to submit review")
      } finally {
        setIsSubmitting(false)
      }
    },
    [product.id, formRating, formComment, reviewImage, reviewImagePreview]
  )

  return (
    <section
      id="reviews"
      className={cn("scroll-mt-20", className)}
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
                {review.image ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setPreviewImageUrl(review.image ?? null)}
                      className="group relative block overflow-hidden rounded-md border border-border text-left ring-offset-background transition-[box-shadow,opacity] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="Open review image preview"
                    >
                      <Image
                        src={review.image}
                        alt=""
                        width={80}
                        height={80}
                        className="max-w-full rounded-md object-contain sm:max-w-md"
                      />
                    </button>
                  </div>
                ) : null}
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

      <Dialog
        open={previewImageUrl !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewImageUrl(null)
        }}
      >
        <DialogContent className="max-h-[90dvh] w-auto max-w-[min(100vw-2rem,56rem)] gap-0 overflow-hidden p-2 sm:p-4 md:min-w-[400px] md:min-h-[400px]">
          <DialogTitle className="sr-only">Review image</DialogTitle>
          {previewImageUrl ? (
            <div className="flex  items-center justify-center">
              <Image
                src={previewImageUrl}
                width={500}
                height={500}
                alt="Review attachment"
                className=" w-auto max-w-full rounded-md object-contain md:min-w-[400px] md:min-h-[400px]"
              />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted/10" />
          )}
        </DialogContent>
      </Dialog>

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
            <div>
              <Label htmlFor="review-image" className="text-muted-foreground">
                Photo (optional)
              </Label>
              <div className="mt-1">
                {reviewImagePreview ? (
                  <div
                    className={cn(
                      "group relative inline-block h-32 w-[200px]",
                      isSubmitting && "pointer-events-none opacity-50"
                    )}
                  >
                    <label
                      htmlFor="review-image"
                      className="relative block size-full cursor-pointer overflow-hidden rounded-md border border-border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob or remote URL */}
                      <img
                        src={reviewImagePreview}
                        alt="Review preview"
                        className="size-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="px-2 text-center text-sm font-medium text-white">
                          Replace image
                        </span>
                      </div>
                      <input
                        id="review-image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isSubmitting}
                        onChange={handleReviewImageChange}
                      />
                    </label>
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (reviewImagePreview) URL.revokeObjectURL(reviewImagePreview)
                        setReviewImage(null)
                        setReviewImagePreview(null)
                      }}
                      aria-label="Remove image"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="review-image"
                    className={cn(
                      "inline-flex h-32 w-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50",
                      isSubmitting && "pointer-events-none opacity-50"
                    )}
                  >
                    <ImagePlus className="size-6 shrink-0" />
                    Add image
                    <input
                      id="review-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={isSubmitting}
                      onChange={handleReviewImageChange}
                    />
                  </label>
                )}
              </div>
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
    </section>
  )
}
