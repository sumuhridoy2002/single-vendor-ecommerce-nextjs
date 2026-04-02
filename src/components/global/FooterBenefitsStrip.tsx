export function FooterBenefitsStrip() {
  return (
    <section aria-label="Store benefits" className="w-full bg-[#b40b5a]">
      <div className="container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <div className="flex items-center gap-3 text-white">
          <div className="flex size-10 items-center justify-center rounded bg-white/10">
            <span className="text-xl leading-none">✓</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">100% Authentic</div>
            <div className="text-sm font-medium">Products</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <div className="flex size-10 items-center justify-center rounded bg-white/10">
            <span className="text-xl leading-none">▦</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">15000+ </div>
            <div className="text-sm font-medium">Products</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <div className="flex size-10 items-center justify-center rounded bg-white/10">
            <span className="text-xl leading-none">★</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">400+ </div>
            <div className="text-sm font-medium">Exclusive Brands</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <div className="flex size-10 items-center justify-center rounded bg-white/10">
            <span className="text-xl leading-none">🎧</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Free Beauty</div>
            <div className="text-sm font-medium">Consultation</div>
          </div>
        </div>
      </div>
    </section>
  )
}

