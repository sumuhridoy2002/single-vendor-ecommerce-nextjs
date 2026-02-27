import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 text-center">
        {/* Big 404 */}
        <p
          className="mb-2 font-semibold tracking-tighter text-neutral-900"
          style={{
            fontSize: "clamp(6rem, 20vw, 12rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          404
        </p>

        <p className="mb-6 text-lg font-medium text-neutral-500 md:text-xl">
          Page not found
        </p>
        <p className="mx-auto mb-10 max-w-sm text-sm text-neutral-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <Link href="/search">Search</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
