import Link from "next/link";

import { cn } from "@/lib/utils";

import type { FeedType } from "@/features/feed/types/feed-types";

const tabs: Array<{ label: string; type?: FeedType; href?: string; disabled?: boolean }> = [
  { label: "Dành cho bạn", type: "for_you", href: "/" },
  { label: "Đang theo dõi", type: "following", href: "/?feed=following" },
  { label: "Bài viết tự hủy", disabled: true },
];

interface FeedTabsProps {
  activeType: FeedType;
}

export function FeedTabs({ activeType }: FeedTabsProps) {
  return (
    <nav className="grid grid-cols-3" role="tablist" aria-label="Feed tabs">
      {tabs.map((tab) => {
        const isActive = activeType === tab.type;

        if (tab.disabled) {
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected="false"
              aria-disabled="true"
              disabled
              className="flex h-12 min-w-0 items-center justify-center px-2 text-center text-body-sm font-semibold text-muted-foreground opacity-60"
            >
              <span className="truncate">{tab.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={tab.type}
            href={tab.href ?? "/"}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "flex h-12 min-w-0 items-center justify-center px-2 text-center text-body-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive && "text-foreground",
            )}
          >
            <span className="truncate">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
