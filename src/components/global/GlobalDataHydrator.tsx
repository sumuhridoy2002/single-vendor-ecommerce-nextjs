"use client";

import { apiAddressToStore } from "@/lib/api/address-mappers";
import { getAddresses } from "@/lib/api/customer";
import { fetchCategories } from "@/lib/api/categories";
import { fetchHeroSliders } from "@/lib/api/hero-sliders";
import { fetchHomepage } from "@/lib/api/homepage";
import { fetchSettings } from "@/lib/api/settings";
import { globalQueryKeys } from "@/lib/query-keys";
import { useAddressStore } from "@/store/address-store";
import { useCategoriesStore } from "@/stores/categories-store";
import { useHeroSlidersStore } from "@/stores/hero-sliders-store";
import { useHomepageStore } from "@/stores/homepage-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useAccessToken } from "@/hooks/data/useAccessToken";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;
const PERSISTED_QUERY_OPTIONS = {
  staleTime: THIRTY_MINUTES_MS,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days so persisted cache keeps data
} as const;

/**
 * Fetches global API data on first visit, syncs to Zustand stores, and persists
 * in React Query cache. Refetches only when explicitly invalidated.
 */
export function GlobalDataHydrator() {
  const hasAccessToken = useAccessToken().hasAccessToken;
  const setSettings = useSettingsStore((s) => s.setSettings);
  const setCategories = useCategoriesStore((s) => s.setCategories);
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const setData = useHomepageStore((s) => s.setData);
  const setHeroSliders = useHeroSlidersStore((s) => s.setHeroSliders);

  const { data: settingsData } = useQuery({
    queryKey: globalQueryKeys.settings,
    queryFn: async () => {
      const res = await fetchSettings();
      return res.data;
    },
    ...PERSISTED_QUERY_OPTIONS,
  });

  const { data: categoriesData } = useQuery({
    queryKey: globalQueryKeys.categories,
    queryFn: fetchCategories,
    ...PERSISTED_QUERY_OPTIONS,
  });

  const { data: addressesData } = useQuery({
    queryKey: globalQueryKeys.customerAddresses,
    queryFn: async () => {
      const list = await getAddresses();
      return list.map(apiAddressToStore);
    },
    enabled: hasAccessToken(),
    ...PERSISTED_QUERY_OPTIONS,
  });

  const { data: homepageData } = useQuery({
    queryKey: globalQueryKeys.productsHomepage,
    queryFn: fetchHomepage,
    ...PERSISTED_QUERY_OPTIONS,
  });

  const { data: slidersData } = useQuery({
    queryKey: globalQueryKeys.sliders,
    queryFn: fetchHeroSliders,
    ...PERSISTED_QUERY_OPTIONS,
  });

  useEffect(() => {
    if (settingsData) setSettings(settingsData);
  }, [settingsData, setSettings]);

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData, setCategories]);

  useEffect(() => {
    if (addressesData) setAddresses(addressesData);
  }, [addressesData, setAddresses]);

  useEffect(() => {
    if (homepageData) setData(homepageData);
  }, [homepageData, setData]);

  useEffect(() => {
    if (slidersData) setHeroSliders(slidersData);
  }, [slidersData, setHeroSliders]);

  return null;
}
