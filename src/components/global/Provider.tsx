"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import {
  QueryClient,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Toaster } from "@/components/ui/sonner";
import { SettingsHydrator } from "./SettingsHydrator";
import { useMemo } from "react";

const CACHE_KEY = "GLOBAL_SETTINGS_QUERY_CACHE";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000,
      },
    },
  });
}

function makePersister() {
  return createSyncStoragePersister({
    storage: typeof window === "undefined" ? undefined : window.localStorage,
    key: CACHE_KEY,
    throttleTime: 1000,
  });
}

const Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(() => makeQueryClient(), []);
  const persister = useMemo(() => makePersister(), []);

  return (
    <SessionProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <AuthProvider>
          <SettingsHydrator />
          {children}
          <Toaster />
        </AuthProvider>
      </PersistQueryClientProvider>
    </SessionProvider>
  );
};

export default Provider;
