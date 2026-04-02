import type { ProductReview } from "@/types/product"

export interface ProductReviewSummary {
  averageRating: number
  reviewCount: number
}

export function getProductReviewSummary(
  reviews?: ProductReview[] | null,
  fallbackReviewCount?: number
): ProductReviewSummary {
  const validReviews = (reviews ?? []).filter(
    (review) => typeof review.rating === "number" && Number.isFinite(review.rating)
  )

  const averageRating =
    validReviews.length > 0
      ? validReviews.reduce((sum, review) => sum + review.rating, 0) / validReviews.length
      : 0

  return {
    averageRating,
    reviewCount: fallbackReviewCount ?? validReviews.length,
  }
}
