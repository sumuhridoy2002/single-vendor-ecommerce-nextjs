"use client";

import React, { useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export type AuthPromoSlide = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const DEFAULT_AUTH_PROMO_SLIDES: AuthPromoSlide[] = [
  {
    title: "Quick & easy ordering process",
    description:
      "Now you can order your medicine from Arogga. We provide all the medicines you need.",
    icon: (
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full text-muted-foreground/60"
        aria-hidden
      >
        <rect
          width="120"
          height="180"
          x="40"
          y="10"
          rx="8"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          width="60"
          height="90"
          x="70"
          y="30"
          rx="4"
          fill="currentColor"
          opacity="0.5"
        />
        <circle cx="100" cy="140" r="20" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Fast & reliable delivery",
    description: "Get your medicines delivered to your doorstep quickly and safely.",
    icon: (
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full text-muted-foreground/60"
        aria-hidden
      >
        <path
          d="M40 120 L100 60 L160 120 L160 160 L40 160 Z"
          fill="currentColor"
          opacity="0.3"
        />
        <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.4" />
        <path
          d="M85 100 L98 113 L115 87"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    title: "Secure & trusted",
    description: "Your health data and payments are secure with us. Shop with confidence.",
    icon: (
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full text-muted-foreground/60"
        aria-hidden
      >
        <rect
          width="140"
          height="100"
          x="30"
          y="50"
          rx="8"
          fill="currentColor"
          opacity="0.3"
        />
        <circle cx="100" cy="100" r="25" fill="currentColor" opacity="0.4" />
        <path
          d="M90 100 L97 107 L112 92"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          opacity="0.6"
        />
      </svg>
    ),
  },
];

type AuthPromoSwiperProps = {
  slides?: AuthPromoSlide[];
  className?: string;
};

export function AuthPromoSwiper({
  slides = DEFAULT_AUTH_PROMO_SLIDES,
  className,
}: AuthPromoSwiperProps) {
  const [promoIndex, setPromoIndex] = useState(0);

  return (
    <div
      className={[
        "bg-muted/50 relative hidden md:flex flex-col overflow-hidden min-h-[320px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => setPromoIndex(swiper.realIndex)}
        onSlideChange={(swiper) => setPromoIndex(swiper.realIndex)}
        className="auth-promo-swiper flex-1 min-h-0 w-full h-full"
        speed={500}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
              <div className="w-full max-w-[200px] h-[200px] mx-auto mb-6 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {slide.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{slide.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{slide.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all inline-block ${i === promoIndex ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30"
              }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

