import { CategoryBar } from "@/components/global/category-bar";
import { MobileBottomNavWithAccountSheet } from "@/components/global/MobileBottomNavWithAccountSheet";
import Navbar from "@/components/global/navbar";
import Provider from "@/components/global/Provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "স্কিন কেয়ার ও বিউটি প্রোডাক্টের বিশ্বস্ত ঠিকানা| Beauty Care BD",
  description: "BeautyCare.com.bd - বাংলাদেশের বিশ্বস্ত অনলাইন বিউটি শপ। এখানে পাবেন ১০০% অরিজিনাল স্কিন কেয়ার, হেয়ার কেয়ার, মেকআপ ও বডি কেয়ার প্রোডাক্ট একদম হাতের নাগালে।",
};

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
          <SidebarProvider>
            <div className="flex min-h-svh w-full flex-col">
              <Navbar />
              <CategoryBar />
              <div className="flex min-h-0 flex-1 pb-16 md:pb-0">{children}</div>
              <MobileBottomNavWithAccountSheet />
            </div>
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  );
}
