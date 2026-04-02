"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCampaignDetails } from "@/hooks/data/useCampaignDetails"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"
import { mapProductListItemToProduct } from "@/lib/api/products"
import { useCartStore } from "@/store/cart-store"
import type { AddToCartOptions, Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use, useMemo } from "react"
import { toast } from "sonner"

type Props = {
  params: Promise<{ id: string }>
}

function formatDateTime(value: string): string {
  const date = new Date(value.replace(" ", "T"))
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function CampaignPage({ params }: Props) {
  const { id } = use(params)
  const campaignId = Number(id)

  if (!Number.isFinite(campaignId) || campaignId <= 0) {
    notFound()
  }

  const { campaign, isLoading, error } = useCampaignDetails(campaignId)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const whenLoggedIn = useWhenLoggedIn()

  const products = useMemo(
    () => (campaign?.products ?? []).map(mapProductListItemToProduct),
    [campaign?.products]
  )

  const handleAddToCart = (product: Product, options?: AddToCartOptions) => {
    whenLoggedIn(() => {
      addItem(product, 1, { campaignId, ...options })
        .then(() => openCart())
        .catch((e) => toast.error(e?.message ?? "Failed to add to cart"))
    })
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        <p>{error.message}</p>
      </div>
    )
  }

  if (isLoading || !campaign) {
    return (
      <div className="container py-8">
        <div className="h-6 w-52 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-[220px] animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="container py-4 md:py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{campaign.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-4 overflow-hidden rounded-lg border bg-card">
          <div className="relative aspect-16/6 w-full">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-1 p-4">
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {campaign.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(campaign.start_date)} - {formatDateTime(campaign.end_date)}
            </p>
          </div>
        </div>
      </div>

      <CategoryProductSection
        title="Campaign Products"
        products={products}
        sectionBgClassName="bg-primary/5"
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
