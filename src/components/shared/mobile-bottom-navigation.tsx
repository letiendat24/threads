"use client";

import { Bell, Home, MoreHorizontal, Plus, Search, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const mobileNavigationIcons = {
  home: Home,
  search: Search,
  create: Plus,
  activity: Bell,
  profile: UserRound,
  settings: Settings,
  more: MoreHorizontal,
} as const;

function isActivePath(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNavigation() {
  const pathname = usePathname();
  const openComposer = useUiStore((state) => state.openComposer);

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid h-mobile-nav grid-cols-5 border-t border-border bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1 backdrop-blur md:hidden"
    >
      {primaryNavigationItems.map((item) => {
        const Icon = mobileNavigationIcons[item.icon];

        if (item.type === "action") {
          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => openComposer("post")}
            >
              <Icon className="size-6" aria-hidden="true" />
              <span className="text-mobile-nav">{item.label}</span>
            </button>
          );
        }

        const isActive = isActivePath(pathname, item.href, item.exact);

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive && "bg-surface-active text-foreground",
            )}
          >
            <Icon className={cn("size-6", isActive && "stroke-[2.5]")} aria-hidden="true" />
            <span className="text-mobile-nav max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
