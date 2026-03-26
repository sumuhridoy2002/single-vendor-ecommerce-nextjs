import type { CmsPageListItem } from "@/types/cms-page";

export type PolicyKind = "terms" | "privacy" | "refund";

type PolicyCandidate = {
  /** Fallback route in this repo (static app pages). */
  accountHref: string;
  /** Optional CMS slugs (from `/pages` API). */
  cmsSlugs: string[];
};

const POLICY_CANDIDATES: Record<PolicyKind, PolicyCandidate> = {
  terms: {
    accountHref: "/page/terms-conditions",
    cmsSlugs: ["terms", "terms-and-conditions", "terms-conditions", "terms-condition"],
  },
  privacy: {
    accountHref: "/page/privacy-policy",
    cmsSlugs: ["privacy", "privacy-policy", "privacy-policy-and-terms"],
  },
  refund: {
    accountHref: "/page/return-policy",
    cmsSlugs: [
      "refund-policy",
      "return-policy",
      "return-and-refund-policy",
      "refund-return-policy",
      "return-refund-policy",
    ],
  },
};

function cmsHasSlug(pages: CmsPageListItem[] | null | undefined, slug: string) {
  if (!pages) return false;
  return pages.some((p) => p.slug === slug);
}

/**
 * Picks the best href for a policy:
 * - If the CMS `/pages` API includes a matching slug, we link to `/page/[slug]`.
 * - Otherwise, we fall back to the static `/account/...` route.
 */
export function pickPolicyHref(kind: PolicyKind, pages: CmsPageListItem[] | null) {
  const { accountHref, cmsSlugs } = POLICY_CANDIDATES[kind];
  const foundCmsSlug = cmsSlugs.find((s) => cmsHasSlug(pages, s));
  return foundCmsSlug ? `/page/${foundCmsSlug}` : accountHref;
}

