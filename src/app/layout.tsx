import { CategoryBar } from "@/components/global/category-bar";
import { DynamicHeadSync } from "@/components/global/DynamicHeadSync";
import { MobileBottomNavWithAccountSheet } from "@/components/global/MobileBottomNavWithAccountSheet";
import Navbar from "@/components/global/navbar";
import Provider from "@/components/global/Provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchSettingsSafe } from "@/lib/api/settings";
import { getSiteOrigin, normalizeMediaUrl } from "@/lib/api/client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "স্কিন কেয়ার ও বিউটি প্রোডাক্টের বিশ্বস্ত ঠিকানা | Beauty Care BD",
  description:
    "BeautyCare.com.bd - বাংলাদেশের বিশ্বস্ত অনলাইন বিউটি শপ। এখানে পাবেন ১০০% অরিজিনাল স্কিন কেয়ার, হেয়ার কেয়ার, মেকআপ ও বডি কেয়ার প্রোডাক্ট একদম হাতের নাগালে।",
};

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetchSettingsSafe();
  if (!res?.data) return DEFAULT_METADATA;

  const { site_name, site_tagline, site_description, favicon } = res.data;

  return {
    metadataBase: new URL(getSiteOrigin()),
    title: {
      default: `${site_name} | ${site_tagline}`,
      template: `%s | ${site_name}`,
    },
    description: site_description,
    icons: {
      icon: normalizeMediaUrl(favicon) ?? favicon,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <Provider>
          <DynamicHeadSync />
          <SidebarProvider>
            <div className="flex min-h-svh w-full flex-col">
              <Navbar />
              <CategoryBar />
              <div className="flex min-h-0 flex-1">
                {children}
              </div>
              <MobileBottomNavWithAccountSheet />
            </div>
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  );
}
