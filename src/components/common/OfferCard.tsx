"use client"

import { cn } from "@/lib/utils"
import type { Offer, OfferIconType, OfferTheme } from "@/types/offer"
import Link from "next/link"
import type { IconType } from "react-icons"
import {
  FaFilePrescription,
  FaFlask,
  FaHeadset,
  FaPhone,
  FaPills,
  FaStore,
  FaWhatsapp,
} from "react-icons/fa"

const OFFER_ICONS: Record<OfferIconType, IconType> = {
  whatsapp: FaWhatsapp,
  prescription: FaFilePrescription,
  pharmacy: FaStore,
  healthcare: FaPills,
  headset: FaHeadset,
  labtest: FaFlask,
}

const THEME_STYLES: Record<
  OfferTheme,
  { card: string; iconBg: string; button: string }
> = {
  green: {
    card: "from-emerald-50 to-emerald-500",
    iconBg: "bg-emerald-500",
    button: "text-emerald-600 hover:bg-emerald-50",
  },
  blue: {
    card: "from-sky-50 to-sky-500",
    iconBg: "bg-sky-500",
    button: "text-sky-600 hover:bg-sky-50",
  },
  teal: {
    card: "from-teal-50 to-teal-500",
    iconBg: "bg-teal-500",
    button: "text-teal-600 hover:bg-teal-50",
  },
  purple: {
    card: "from-violet-50 to-violet-500",
    iconBg: "bg-violet-500",
    button: "text-violet-600 hover:bg-violet-50",
  },
  orange: {
    card: "from-orange-50 to-orange-500",
    iconBg: "bg-orange-500",
    button: "text-orange-600 hover:bg-orange-50",
  },
  red: {
    card: "from-rose-50 to-rose-500",
    iconBg: "bg-rose-500",
    button: "text-rose-600 hover:bg-rose-50",
  },
}

export interface OfferCardProps {
  offer: Offer
}

export function OfferCard({ offer }: OfferCardProps) {
  const Icon = OFFER_ICONS[offer.icon]
  const styles = THEME_STYLES[offer.theme]
  const content = (
    <>
      <div
        className={cn(
          "absolute right-0 top-0 flex size-16 items-center justify-center rounded-full text-white",
          styles.iconBg
        )}
      >
        <Icon className="size-10" />
      </div>
      <div className="flex flex-1 flex-col justify-start gap-0.5 pt-8">
        <p className="text-lg font-semibold uppercase tracking-wide opacity-90 pb-1">
          {offer.title}
        </p>
        <p className="text-[22px] font-bold leading-tight pb-1">{offer.subtitle}</p>
        {offer.extra && (
          <p className="flex items-center gap-1.5 text-lg font-medium">
            {offer.icon === "headset" && (
              <FaPhone className="h-3.5 w-3.5 text-rose-400" />
            )}
            {offer.extra}
          </p>
        )}
      </div>
      <button
        className={cn(
          "mt-6 flex w-full items-center justify-center rounded-lg bg-white/90 py-3 text-base font-bold transition-colors dark:bg-white/10",
          styles.button
        )}
      >
        {offer.buttonText}
      </button>
    </>
  )

  const cardClass = cn(
    "relative flex w-full min-w-[140px] flex-col rounded-l-xl rounded-br-xl rounded-tr-[50%] bg-gradient-to-b p-4",
    styles.card
  )

  if (offer.href) {
    return (
      <Link href={offer.href} className={cardClass}>
        {content}
      </Link>
    )
  }

  return <div className={cardClass}>{content}</div>
}
