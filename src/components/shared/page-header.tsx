import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  tabs?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, tabs, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-mobile-header z-20 border-b border-border bg-background/92 backdrop-blur md:top-0",
        className,
      )}
    >
      <div className="flex min-h-14 items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-page-title text-foreground">{title}</h1>
          {description ? (
            <p className="mt-0.5 truncate text-metadata text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {tabs ? <div className="border-t border-border">{tabs}</div> : null}
    </header>
  );
}
