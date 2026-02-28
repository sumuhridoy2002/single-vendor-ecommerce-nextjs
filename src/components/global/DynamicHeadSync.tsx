"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";

const DESCRIPTION_META_ID = "dynamic-meta-description";
const FAVICON_LINK_ID = "dynamic-favicon";

/**
 * Syncs document title, meta description, and favicon from global settings (Zustand).
 * Complements server-generated metadata so client-side updates (e.g. after cache restore) are reflected.
 */
export function DynamicHeadSync() {
  const settings = useSettingsStore((s) => s.settings);

  useEffect(() => {
    if (!settings) return;

    const { site_name, site_tagline, site_description, favicon } = settings;
    const defaultTitle = `${site_name} | ${site_tagline}`;

    document.title = defaultTitle;

    let meta = document.getElementById(DESCRIPTION_META_ID) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.id = DESCRIPTION_META_ID;
      meta.name = "description";
      meta.content = site_description;
      document.head.appendChild(meta);
    } else {
      meta.content = site_description;
    }

    let link = document.getElementById(FAVICON_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = FAVICON_LINK_ID;
      link.rel = "icon";
      link.href = favicon;
      document.head.appendChild(link);
    } else {
      link.href = favicon;
    }
  }, [settings]);

  return null;
}
