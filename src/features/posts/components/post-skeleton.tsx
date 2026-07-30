import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PostSkeletonProps {
  media?: boolean;
  className?: string;
}

export function PostSkeleton({ media = false, className }: PostSkeletonProps) {
  return (
    <div className={cn("border-b border-border px-4 py-4", className)} aria-hidden="true">
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
        <div className="flex flex-col items-center">
          <Skeleton className="size-11 rounded-full" />
          <Skeleton className="mt-2 h-16 w-px" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="mt-3 h-4 w-11/12" />
          <Skeleton className="mt-2 h-4 w-3/5" />
          {media ? <Skeleton className="mt-3 aspect-video w-full rounded-lg" /> : null}
          <div className="mt-4 flex gap-4">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="size-6 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostSkeletonList() {
  return (
    <div role="status" aria-label="Loading posts">
      <PostSkeleton media />
      <PostSkeleton />
      <PostSkeleton media />
    </div>
  );
}
