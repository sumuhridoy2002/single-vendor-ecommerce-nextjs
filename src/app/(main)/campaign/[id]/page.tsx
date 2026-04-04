import { fetchCampaignById } from "@/lib/api/campaigns"
import { fetchSettingsSafe } from "@/lib/api/settings"
import { getSiteOrigin } from "@/lib/api/client"
import { buildEventJsonLd } from "@/lib/seo/jsonld"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CampaignPageContent } from "./CampaignPageContent"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const campaignId = Number(id)
  if (!Number.isFinite(campaignId) || campaignId <= 0) return { title: "Campaign" }

  try {
    const campaign = await fetchCampaignById(campaignId)
    const title = campaign.meta?.title ?? campaign.title
    const description = campaign.meta?.description ?? undefined
    const keywords = campaign.meta?.keywords ?? undefined
    return {
      title,
      description: description?.slice(0, 160) ?? undefined,
      keywords: keywords ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        type: "website",
        ...(campaign.image ? { images: [campaign.image] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description ?? undefined,
        ...(campaign.image ? { images: [campaign.image] } : {}),
      },
    }
  } catch {
    return { title: "Campaign" }
  }
}

export default async function CampaignPage({ params }: Props) {
  const { id } = await params
  const campaignId = Number(id)

  if (!Number.isFinite(campaignId) || campaignId <= 0) {
    notFound()
  }

  let jsonLd: ReturnType<typeof buildEventJsonLd> | null = null
  try {
    const [campaign, settings] = await Promise.all([
      fetchCampaignById(campaignId),
      fetchSettingsSafe(),
    ])
    const siteUrl = getSiteOrigin()
    const siteName = settings?.data.site_name ?? "Beauty Care BD"
    jsonLd = buildEventJsonLd(campaign, siteUrl, siteName)
  } catch {
    // non-fatal — render page without JSON-LD
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CampaignPageContent campaignId={campaignId} />
    </>
  )
}
