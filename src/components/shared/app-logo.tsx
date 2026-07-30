import Link from "next/link";

import { cn } from "@/lib/utils";

interface AppLogoProps {
  compact?: boolean;
  className?: string;
}

export function AppLogo({ compact = false, className }: AppLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Threads Clone home"
      className={cn(
        "inline-flex items-center rounded-full text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        compact ? "size-11 justify-center" : "gap-3 px-3 py-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-full border border-border-strong bg-primary text-primary-foreground"
      >
        <span className="text-section-title">@</span>
      </span>
      {compact ? null : <span className="text-nav-label">Threads</span>}
    </Link>
  );
}
