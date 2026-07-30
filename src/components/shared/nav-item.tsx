"use client";

import { Bell, Home, MoreHorizontal, Plus, Search, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const navigationIcons = {
  home: Home,
  search: Search,
  create: Plus,
  activity: Bell,
  profile: UserRound,
  settings: Settings,
  more: MoreHorizontal,
} as const;

interface NavItemProps {
  item: NavigationItem;
  compact?: boolean;
}

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavItem({ item, compact = false }: NavItemProps) {
  const pathname = usePathname();
  const openComposer = useUiStore((state) => state.openComposer);
  const Icon = navigationIcons[item.icon];

  const className = cn(
    "group inline-flex h-12 items-center rounded-full text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    compact ? "w-12 justify-center" : "w-full justify-start gap-4 px-4",
  );

  if (item.type === "action") {
    const button = (
      <button
        type="button"
        className={className}
        aria-label={compact ? item.label : undefined}
        onClick={() => openComposer("post")}
      >
        <Icon className="size-6" aria-hidden="true" />
        {compact ? null : <span className="text-nav-label">{item.label}</span>}
      </button>
    );

    if (!compact) {
      return button;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  const isActive = isActivePath(pathname, item.href, item.exact);
  const link = (
    <Link
      href={item.href}
      className={cn(className, isActive && "bg-surface-active font-semibold")}
      aria-current={isActive ? "page" : undefined}
      aria-label={compact ? item.label : undefined}
    >
      <Icon
        className={cn("size-6", isActive ? "stroke-[2.5]" : "text-muted-foreground")}
        aria-hidden="true"
      />
      {compact ? null : <span className="text-nav-label">{item.label}</span>}
    </Link>
  );

  if (!compact) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
