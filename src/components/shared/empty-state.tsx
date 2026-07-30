import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center",
        className,
      )}
    >
      <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-3 text-section-title text-foreground">{title}</h2>
      {description ? <p className="mt-2 max-w-sm text-body-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
