import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Soft background elements */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(12px, -60px); }
          66% { transform: translate(-8px, 50px); }
        }
        @keyframes float-slow-alt {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -100px); }
        }
        @keyframes float-slow-mid {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(calc(-50% + 280px), 20px); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-slow-alt { animation: float-slow-alt 14s ease-in-out infinite; }
        .animate-float-slow-mid { animation: float-slow-mid 10s ease-in-out infinite; }
      `}</style>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 size-48 sm:size-64 md:size-80 lg:size-96 rounded-full bg-primary/50 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 -right-32 size-64 sm:size-80 md:size-96 lg:size-[28rem] rounded-full bg-primary/20 blur-3xl animate-float-slow-alt" />
        <div className="absolute left-1/2 top-1/3 size-64 sm:size-80 md:size-96 lg:size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 blur-3xl animate-float-slow-mid" />
      </div>

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

      {/* Decorative line */}
      <div className="absolute bottom-8 left-1/2 h-px w-24 -translate-x-1/2 bg-linear-to-r from-transparent via-neutral-300 to-transparent" />
    </div>
  );
}
