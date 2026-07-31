import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface AppLogoProps {
  compact?: boolean;
  className?: string;
}

export function AppLogo({ compact = false, className }: AppLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Soi chi city home"
      className={cn(
        "inline-flex items-center rounded-full text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        compact ? "size-11 justify-center" : "gap-3 px-3 py-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center overflow-hidden rounded-full border border-border-strong bg-primary"
      >
        <Image src="/images/logos/soi-chi-city-mark.svg" alt="" width={32} height={32} priority />
      </span>
      {compact ? null : <span className="text-nav-label">Soi chi city</span>}
    </Link>
  );
}
