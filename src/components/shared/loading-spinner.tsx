import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = "Loading", className }: LoadingSpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}>
      <span
        className="size-4 animate-spin rounded-full border-2 border-muted border-t-current"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
