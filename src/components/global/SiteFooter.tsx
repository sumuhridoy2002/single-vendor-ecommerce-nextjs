"use client";

import LogoSvg from "@/components/svg/logo";
import { useCategories } from "@/hooks/data/useCategories";
import { cn } from "@/lib/utils";
import { usePagesStore } from "@/stores/pages-store";
import { useSettingsStore } from "@/stores/settings-store";
import type { CmsPageListItem } from "@/types/cms-page";
import { ArrowUp, Facebook, MapPin, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";

function pageHref(slug: string, pages: CmsPageListItem[] | null): string | null {
  const p = pages?.find((x) => x.slug === slug);
  return p ? `/page/${p.slug}` : null;
}

const footerBg = "bg-[#0a1628]";



export function SiteFooter() {
  const settings = useSettingsStore((s) => s.settings);
  const pages = usePagesStore((s) => s.pages);
  const { categories } = useCategories();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const year = new Date().getFullYear();
  const siteName = settings?.site_name ?? "Store";
  const tagline = settings?.site_tagline || settings?.site_description || "";
  const address = settings?.site_address ?? "";
  const hotline = settings?.support_phone ?? "";
  const wa = settings?.social_wa ?? "";

  const rootCategories = categories.slice(0, 4);

  const quickLinks: { label: string; href: string }[] = [
    ...(pageHref("careers", pages) ? [{ label: "Careers", href: pageHref("careers", pages)! }] : []),
    { label: "Privacy Policy", href: "/account/privacy" },
    { label: "Terms and Conditions", href: "/account/terms" },
    { label: "Return and Refund Policy", href: "/account/refund-policy" },
  ];

  const serviceLinks = rootCategories.map((c) => ({
    label: c.name,
    href: `/category/${c.slug}`,
  }));

  const usefulLinks: { label: string; href: string }[] = [
    { label: "FAQ", href: "/account/faq" },
    { label: "Account", href: "/account" },
    ...(pageHref("register-pharmacy", pages)
      ? [{ label: "Register the Pharmacy", href: pageHref("register-pharmacy", pages)! }]
      : pageHref("register-the-pharmacy", pages)
        ? [{ label: "Register the Pharmacy", href: pageHref("register-the-pharmacy", pages)! }]
        : []),
    { label: "Special Offers", href: "/account/offers" },
  ];

  const socialItems: { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [];
  if (settings?.social_fb)
    socialItems.push({ href: settings.social_fb, label: "Facebook", Icon: Facebook });
  // if (settings?.social_ig)
  //   socialItems.push({ href: settings.social_ig, label: "Instagram", Icon: Instagram });
  if (settings?.social_yt)
    socialItems.push({ href: settings.social_yt, label: "YouTube", Icon: Youtube });
  if (settings?.social_tiktok)
    socialItems.push({ href: settings.social_tiktok, label: "TikTok", Icon: SiTiktok });

  // const paymentChips: { key: string; label: string; show: boolean }[] = [
  //   { key: "bkash", label: "bKash", show: settings?.bkash_status === true },
  //   { key: "nagad", label: "Nagad", show: true },
  //   { key: "rocket", label: "Rocket", show: true },
  //   { key: "visa", label: "Visa", show: true },
  //   { key: "mc", label: "Mastercard", show: true },
  //   { key: "amex", label: "Amex", show: true },
  //   { key: "cod", label: "COD", show: settings?.cod_status === true },
  // ];

  return (
    <footer className={cn(footerBg, "relative mt-auto text-white pb-20 md:pb-0")}>
      <div className="container py-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block rounded-lg bg-white p-3 shadow-sm">
              <LogoSvg />
            </Link>
            {tagline ? (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">{tagline}</p>
            ) : null}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold tracking-wide">Quick Links</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/90">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-primary-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold tracking-wide">Our Services</h3>
            {serviceLinks.length > 0 ? (
              <ul className="flex flex-col gap-2.5 text-sm text-white/90">
                {serviceLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-primary-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/60">Categories loading…</p>
            )}
          </div>

          {/* Useful + App */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wide">Useful Links</h3>
              <ul className="flex flex-col gap-2.5 text-sm text-white/90">
                {usefulLinks.map((item) => (
                  <li key={item.label + item.href}>
                    <Link href={item.href} className="transition-colors hover:text-primary-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact + pay + verify */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wide">Contact Info</h3>
              <ul className="space-y-3 text-sm text-white/90">
                {hotline ? (
                  <li className="flex gap-2">
                    <Phone className="mt-0.5 size-4 shrink-0 text-primary-light" aria-hidden />
                    <span>
                      Hotline:{" "}
                      <a href={`tel:${hotline.replace(/\s/g, "")}`} className="hover:underline">
                        {hotline}
                      </a>
                    </span>
                  </li>
                ) : null}
                {wa ? (
                  <li className="flex gap-2">
                    <FaWhatsapp className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                    <span>
                      Whatsapp:{" "}
                      <a
                        href={wa.startsWith("http") ? wa : `https://wa.me/${wa.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {wa}
                      </a>
                    </span>
                  </li>
                ) : null}
                {address ? (
                  <li className="flex gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-sky-400" aria-hidden />
                    <span>Address: {address}</span>
                  </li>
                ) : null}
              </ul>
            </div>

            {socialItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialItems.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-4 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {settings?.trade_license ? (
              <>
                Trade License: {settings.trade_license}
                {settings.bin_no ? (
                  <>
                    {" "}
                    DBID: {settings.bin_no}
                  </>
                ) : null}
              </>
            ) : (
              <span className="text-white/50">Trade license information from site settings</span>
            )}
          </p>
          <p className="text-white/80">
            © {year} {siteName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={cn(
          "fixed bottom-24 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white text-[#0a1628] shadow-lg transition-all hover:bg-white/95 md:bottom-8",
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <ArrowUp className="size-5" />
      </button>

      {/* Chat hint — optional floating action; uses support WhatsApp if set */}
      {wa ? (
        <a
          href={wa.startsWith("http") ? wa : `https://wa.me/${wa.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "fixed right-4 z-40 flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:scale-105",
            showScrollTop ? "bottom-40 md:bottom-24" : "bottom-24 md:bottom-8"
          )}
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="size-6" />
        </a>
      ) : null}
    </footer>
  );
}
