"use client"

import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";

const Provider = ({ children }: { children: React.ReactNode }) => {

  const queryClient = new QueryClient()


  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Provider;