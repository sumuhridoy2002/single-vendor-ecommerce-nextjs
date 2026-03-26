"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import { usePagesStore } from "@/stores/pages-store";
import type { CmsPageListItem } from "@/types/cms-page";
import { pickPolicyHref, type PolicyKind } from "@/lib/legal/policy-hrefs";

type HrefAvailabilityCache = Record<string, { ok: boolean; ts: number }>;

const AVAIL_CACHE_KEY = "policy-href-availability:v1";
const AVAIL_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function readAvailabilityCache(): HrefAvailabilityCache {
  try {
    const raw = localStorage.getItem(AVAIL_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as HrefAvailabilityCache;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAvailabilityCache(cache: HrefAvailabilityCache) {
  try {
    localStorage.setItem(AVAIL_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

async function checkHrefAvailable(href: string, signal: AbortSignal): Promise<boolean> {
  // HEAD is cheaper, but some servers might not allow it. If HEAD fails, retry with GET.
  try {
    const headRes = await fetch(href, { method: "HEAD", signal });
    // `res.ok` is only 2xx. A redirect (3xx) should still be considered "available".
    if (headRes.status >= 200 && headRes.status < 400) return true;
    if (headRes.status === 405) {
      const getRes = await fetch(href, { method: "GET", signal, cache: "no-store" });
      return getRes.status >= 200 && getRes.status < 400;
    }
    return false;
  } catch {
    return false;
  }
}

function useHrefAvailability(hrefs: string[], enabled: boolean) {
  const hrefKey = useMemo(() => hrefs.slice().sort().join("|"), [hrefs]);
  const [available, setAvailable] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (hrefs.length === 0) return;

    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    (async () => {
      const now = Date.now();
      const cache = readAvailabilityCache();
      const nextCache: HrefAvailabilityCache = { ...cache };
      const nextAvailable: Record<string, boolean> = {};

      await Promise.all(
        hrefs.map(async (href) => {
          const cached = cache[href];
          if (cached && now - cached.ts < AVAIL_TTL_MS) {
            nextAvailable[href] = cached.ok;
            return;
          }
          const ok = await checkHrefAvailable(href, controller.signal);
          nextAvailable[href] = ok;
          nextCache[href] = { ok, ts: now };
        })
      );

      if (cancelled) return;
      writeAvailabilityCache(nextCache);
      setAvailable((prev) => ({ ...prev, ...nextAvailable }));
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [hrefKey, enabled, hrefs]);

  return available;
}

function cmsPolicyHrefOrAccount(kind: PolicyKind, pages: CmsPageListItem[] | null) {
  return pickPolicyHref(kind, pages);
}

export function PolicyConsentLinks({
  enabled = false,
  termsText = "Terms & Conditions",
  privacyText = "Privacy Policy",
  refundText = "Refund-Return Policy",
  linkClassName = "text-primary hover:underline underline-offset-2",
  onLinkClick,
}: {
  enabled?: boolean;
  termsText?: string;
  privacyText?: string;
  refundText?: string;
  linkClassName?: string;
  onLinkClick?: () => void;
}) {
  const pages = usePagesStore((s) => s.pages);

  const termsHref = useMemo(() => cmsPolicyHrefOrAccount("terms", pages), [pages]);
  const privacyHref = useMemo(() => cmsPolicyHrefOrAccount("privacy", pages), [pages]);
  const refundHref = useMemo(() => cmsPolicyHrefOrAccount("refund", pages), [pages]);

  const hrefs = useMemo(() => [termsHref, privacyHref, refundHref], [termsHref, privacyHref, refundHref]);
  const availableMap = useHrefAvailability(hrefs, enabled);

  const termsAvailable = availableMap[termsHref] !== false;
  const privacyAvailable = availableMap[privacyHref] !== false;
  const refundAvailable = availableMap[refundHref] !== false;

  const parts: Array<{ key: PolicyKind; href: string; label: string; visible: boolean }> = [
    { key: "terms", href: termsHref, label: termsText, visible: termsAvailable },
    { key: "privacy", href: privacyHref, label: privacyText, visible: privacyAvailable },
    { key: "refund", href: refundHref, label: refundText, visible: refundAvailable },
  ];
  const visibleParts = parts.filter((p) => p.visible);

  // Safety net: if availability checks/cached results hide everything,
  // still render the static fallback policy routes.
  if (visibleParts.length === 0) {
    const termsFallbackHref = pickPolicyHref("terms", null);
    const privacyFallbackHref = pickPolicyHref("privacy", null);
    const refundFallbackHref = pickPolicyHref("refund", null);
    return (
      <>
        <Link href={termsFallbackHref} className={linkClassName} onClick={onLinkClick}>
          {termsText}
        </Link>
        {", "}
        <Link href={privacyFallbackHref} className={linkClassName} onClick={onLinkClick}>
          {privacyText}
        </Link>
        {" "}
        &{" "}
        <Link href={refundFallbackHref} className={linkClassName} onClick={onLinkClick}>
          {refundText}
        </Link>
      </>
    );
  }

  if (visibleParts.length === 1) {
    return (
      <Link href={visibleParts[0].href} className={linkClassName} onClick={onLinkClick}>
        {visibleParts[0].label}
      </Link>
    );
  }

  if (visibleParts.length === 2) {
    return (
      <>
        <Link href={visibleParts[0].href} className={linkClassName} onClick={onLinkClick}>
          {visibleParts[0].label}
        </Link>
        {", "}
        <Link href={visibleParts[1].href} className={linkClassName} onClick={onLinkClick}>
          {visibleParts[1].label}
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href={termsHref} className={linkClassName} onClick={onLinkClick}>
        {termsText}
      </Link>
      {", "}
      <Link href={privacyHref} className={linkClassName} onClick={onLinkClick}>
        {privacyText}
      </Link>
      {" "}
      &{" "}
      <Link href={refundHref} className={linkClassName} onClick={onLinkClick}>
        {refundText}
      </Link>
    </>
  );
}

export function PolicySingleLink({
  kind,
  label,
  className = "text-sm font-medium text-primary hover:underline",
}: {
  kind: PolicyKind;
  label: string;
  className?: string;
}) {
  const pages = usePagesStore((s) => s.pages);
  const href = useMemo(() => pickPolicyHref(kind, pages), [kind, pages]);
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

