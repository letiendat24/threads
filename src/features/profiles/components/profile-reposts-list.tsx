"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/posts/components/post-card";
import { PostSkeleton, PostSkeletonList } from "@/features/posts/components/post-skeleton";
import { useUserRepostsQuery } from "@/features/profiles/hooks/use-profile-query";

interface ProfileRepostsListProps {
  userId: string;
}

export function ProfileRepostsList({ userId }: ProfileRepostsListProps) {
  const repostsQuery = useUserRepostsQuery(userId);
  const posts = repostsQuery.data?.pages.flatMap((page) => page.posts) ?? [];

  if (repostsQuery.isPending) {
    return <PostSkeletonList />;
  }

  if (repostsQuery.isError && posts.length === 0) {
    return (
      <div className="p-4">
        <ErrorState
          title="Could not load reposts"
          description={repostsQuery.error instanceof Error ? repostsQuery.error.message : "Try again."}
          action={
            <Button type="button" variant="outline" onClick={() => void repostsQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-4">
        <EmptyState title="No reposts yet" description="Reposts from this profile will appear here." />
      </div>
    );
  }

  return (
    <section aria-label="Profile reposts">
      {posts.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} showConnector={index < posts.length - 1} />
      ))}
      {repostsQuery.isFetchingNextPage ? <PostSkeleton className="border-b-0" /> : null}
      {repostsQuery.hasNextPage && !repostsQuery.isFetchingNextPage ? (
        <div className="flex justify-center border-t border-border p-4">
          <Button type="button" variant="outline" onClick={() => void repostsQuery.fetchNextPage()}>
            Load more
          </Button>
        </div>
      ) : null}
      {!repostsQuery.hasNextPage ? (
        <p className="border-t border-border px-4 py-5 text-center text-metadata text-muted-foreground">
          You are all caught up.
        </p>
      ) : null}
    </section>
  );
}
