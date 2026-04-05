import type { GlobalSettings } from "@/types/settings"
import type { BlogDetail } from "@/types/blog"
import type { BrandApi } from "@/types/brand"
import type { CmsPageDetail } from "@/types/cms-page"
import type { CampaignDetails } from "@/types/campaign"
import type { ProductDetailsApi } from "@/types/product-details"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripHtml(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim() || undefined
}

function truncate(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined
  return value.length <= max ? value : `${value.slice(0, max - 1).trim()}…`
}

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

export function buildOrganizationJsonLd(
  settings: GlobalSettings,
  siteUrl: string,
  logoUrl: string | undefined
) {
  const sameAs = [
    settings.social_fb,
    settings.social_ig,
    settings.social_yt,
    settings.social_wa,
    settings.social_tiktok,
  ].filter(Boolean)

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: siteUrl,
    ...(logoUrl
      ? {
          logo: {
            "@type": "ImageObject",
            url: logoUrl,
          },
        }
      : {}),
    ...(settings.support_phone ? { telephone: settings.support_phone } : {}),
    ...(settings.site_address ? { address: settings.site_address } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

// ---------------------------------------------------------------------------
// WebSite + SearchAction
// ---------------------------------------------------------------------------

export function buildWebSiteJsonLd(settings: GlobalSettings, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

// ---------------------------------------------------------------------------
// WebPage (generic — home, CMS, flash-sale, blogs list, etc.)
// ---------------------------------------------------------------------------

export function buildWebPageJsonLd({
  name,
  description,
  url,
  imageUrl,
  breadcrumbs,
}: {
  name: string
  description?: string
  url: string
  imageUrl?: string
  breadcrumbs?: { name: string; url: string }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    ...(description ? { description: truncate(description, 200) } : {}),
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(breadcrumbs?.length
      ? {
          breadcrumb: buildBreadcrumbListJsonLd(breadcrumbs),
        }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// BreadcrumbList (standalone)
// ---------------------------------------------------------------------------

export function buildBreadcrumbListJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ---------------------------------------------------------------------------
// BlogPosting (Article)
// ---------------------------------------------------------------------------

export function buildArticleJsonLd(
  blog: BlogDetail,
  siteUrl: string,
  siteName: string
) {
  const url = `${siteUrl}/blogs/${blog.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    ...(blog.short_description
      ? { description: truncate(stripHtml(blog.short_description), 200) }
      : {}),
    url,
    ...(blog.banner ? { image: blog.banner } : {}),
    datePublished: blog.published_at,
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}

// ---------------------------------------------------------------------------
// Blog (list page)
// ---------------------------------------------------------------------------

export function buildBlogListJsonLd(
  siteName: string,
  siteUrl: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteName} Blog`,
    description,
    url: `${siteUrl}/blogs`,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  }
}

// ---------------------------------------------------------------------------
// CollectionPage (category)
// ---------------------------------------------------------------------------

export function buildCollectionPageJsonLd({
  name,
  description,
  url,
  imageUrl,
  breadcrumbs,
}: {
  name: string
  description?: string | null
  url: string
  imageUrl?: string | null
  breadcrumbs: { name: string; url: string }[]
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name,
      ...(description ? { description: truncate(description, 200) } : {}),
      url,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
    buildBreadcrumbListJsonLd(breadcrumbs),
  ]
}

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export function buildBrandJsonLd(brand: BrandApi, siteUrl: string) {
  const url = `${siteUrl}/brand/${brand.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    url,
    ...(brand.image ? { logo: brand.image } : {}),
    ...(brand.description
      ? { description: truncate(stripHtml(brand.description), 200) }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// SpecialAnnouncement (flash sale)
// ---------------------------------------------------------------------------

export function buildFlashSaleJsonLd(siteName: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    name: `Flash Sale — ${siteName}`,
    text: "Limited-time flash sale with deep discounts on top beauty and skincare products.",
    url: `${siteUrl}/flash-sale`,
    announcementLocation: {
      "@type": "VirtualLocation",
      url: `${siteUrl}/flash-sale`,
    },
  }
}

// ---------------------------------------------------------------------------
// Event (campaign)
// ---------------------------------------------------------------------------

export function buildEventJsonLd(
  campaign: CampaignDetails,
  siteUrl: string,
  siteName: string
) {
  const url = `${siteUrl}/campaign/${campaign.id}`
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: campaign.title,
    startDate: campaign.start_date.replace(" ", "T"),
    endDate: campaign.end_date.replace(" ", "T"),
    url,
    ...(campaign.image ? { image: campaign.image } : {}),
    location: {
      "@type": "VirtualLocation",
      url,
    },
    organizer: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: siteName,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// WebPage for CMS pages
// ---------------------------------------------------------------------------

export function buildCmsPageJsonLd(page: CmsPageDetail, siteUrl: string) {
  const url = `${siteUrl}/page/${page.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    ...(page.meta?.meta_description
      ? { description: truncate(page.meta.meta_description, 200) }
      : {}),
    url,
    ...(page.banner ? { image: page.banner } : {}),
  }
}

// ---------------------------------------------------------------------------
// Product (moved from product/[slug]/page.tsx for reuse)
// ---------------------------------------------------------------------------

/** End of the year after next — used as a stable far-future priceValidUntil. */
function farFuturePriceDate(): string {
  return `${new Date().getFullYear() + 2}-12-31`
}

export function buildProductJsonLd(
  data: ProductDetailsApi,
  siteName: string,
  productUrl: string,
  imageCandidates: string[]
) {
  const rawPrice = data.flash_sale?.is_active
    ? data.flash_sale.flash_final_price
    : data.campaign?.is_active
      ? data.campaign.final_price
      : data.final_price

  // Schema.org validators expect price as a string with decimal notation
  const price = Number(rawPrice).toFixed(2)

  const priceValidUntil = data.campaign?.to
    ? data.campaign.to.split(" ")[0]
    : farFuturePriceDate()

  const averageRating =
    data.recent_reviews?.length
      ? data.recent_reviews.reduce((sum, r) => sum + r.rating, 0) /
        data.recent_reviews.length
      : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.title,
    url: productUrl,
    image: imageCandidates,
    ...(data.short_description
      ? { description: stripHtml(data.short_description) }
      : {}),
    sku: data.sku,
    brand: {
      "@type": "Brand",
      name: data.brand?.name ?? siteName,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price,
      priceValidUntil,
      availability: data.is_in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteName,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "60",
          currency: "BDT",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BD",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    ...(data.reviews_count > 0 && averageRating != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(Math.round(averageRating * 10) / 10),
            reviewCount: String(data.reviews_count),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(data.recent_reviews?.length
      ? {
          review: data.recent_reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.user_name },
            datePublished: r.created_at.split(" ")[0],
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating),
              bestRating: "5",
            },
            reviewBody: r.comment,
          })),
        }
      : {}),
  }
}
