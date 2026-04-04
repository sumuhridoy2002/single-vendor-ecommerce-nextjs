import { fetchSettingsSafe } from "@/lib/api/settings"
import { getSiteOrigin } from "@/lib/api/client"
import { buildWebPageJsonLd } from "@/lib/seo/jsonld"
import type { Metadata } from "next"
import { HomePageContent } from "./HomePageContent"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default async function Home() {
  const settings = await fetchSettingsSafe()
  const siteUrl = getSiteOrigin()
  const siteName = settings?.data.site_name ?? "Beauty Care BD"
  const description =
    settings?.data.site_description ??
    "Your trusted destination for original skincare and beauty products."

  const webPageJsonLd = buildWebPageJsonLd({
    name: siteName,
    description,
    url: siteUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <HomePageContent />
    </>
  )
}
