"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const PLACEHOLDER_BANNER = "/assets/images/placeholder-image.png"

export interface CategoryHeroProps {
  title: string
  subtitle?: string
  image?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

export function CategoryHero({
  title,
  subtitle,
  image = PLACEHOLDER_BANNER,
  ctaLabel = "Shop Now",
  ctaHref,
  className,
}: CategoryHeroProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-muted/30",
        className
      )}
    >
      <div className="grid min-h-[200px] grid-cols-1 md:min-h-[240px] lg:grid-cols-2 lg:min-h-[280px]">
        <div className="flex flex-col justify-center gap-4 px-6 py-8 md:px-8 md:py-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-md text-muted-foreground">{subtitle}</p>
          )}
          {ctaHref && (
            <div>
              <Button asChild size="lg" className="rounded-full">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          )}
        </div>
        <div className="relative aspect-2/1 md:aspect-auto md:min-h-[200px] lg:min-h-[280px]">
          <Image
            src={image}
            alt={title}
            fill
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

