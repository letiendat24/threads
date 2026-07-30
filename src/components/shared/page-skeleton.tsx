import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-feed border-x border-border bg-background p-4">
      <div className="space-y-4" aria-label="Loading page">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </main>
  );
}
