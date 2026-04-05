import LogoSvg from "@/components/svg/logo";

export default function MainRouteLoading() {
  return (
    <div
      className="flex min-h-[45vh] w-full items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-5">
        <div className="animate-pulse">
          <LogoSvg />
        </div>

        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-4 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="size-4 rounded-full bg-primary/70 animate-bounce [animation-delay:120ms]" />
          <span className="size-4 rounded-full bg-primary/50 animate-bounce [animation-delay:240ms]" />
        </div>

        <p className="text-sm text-muted-foreground">Loading page...</p>
      </div>
    </div>
  );
}
