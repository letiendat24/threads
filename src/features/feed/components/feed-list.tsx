"use client";

import { useEffect, useMemo, useRef } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

import { useFeedQuery } from "@/features/feed/hooks/use-feed-query";
import type { FeedType } from "@/features/feed/types/feed-types";
import { PostCard } from "@/features/posts/components/post-card";
import { PostSkeleton, PostSkeletonList } from "@/features/posts/components/post-skeleton";

interface FeedListProps {
  type: FeedType;
}

function getFeedLabel(type: FeedType) {
  return type === "following" ? "following feed" : "home feed";
}

export function FeedList({ type }: FeedListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const feedQuery = useFeedQuery(type);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = feedQuery;

  const posts = useMemo(() => feedQuery.data?.pages.flatMap((page) => page.posts) ?? [], [feedQuery.data]);
  const feedLabel = getFeedLabel(type);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || isFetchingNextPage || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (feedQuery.isPending) {
    return <PostSkeletonList />;
  }

  if (feedQuery.isError && posts.length === 0) {
    return (
      <div className="p-4">
        <ErrorState
          title="Could not load posts"
          description={feedQuery.error instanceof Error ? feedQuery.error.message : "Try refreshing the feed."}
          action={
            <Button type="button" variant="outline" onClick={() => void feedQuery.refetch()}>
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
        <EmptyState
          title={type === "following" ? "No posts from people you follow" : "No posts yet"}
          description={
            type === "following"
              ? "Follow more people to make this feed feel alive."
              : "The feed is connected, but the API returned an empty list."
          }
        />
      </div>
    );
  }

  return (
    <section aria-label={feedLabel}>
      {posts.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} showConnector={index < posts.length - 1} />
      ))}
      <div ref={loadMoreRef} className="min-h-1" aria-hidden="true" />
      {feedQuery.isFetchingNextPage ? <PostSkeleton className="border-b-0" /> : null}
      {feedQuery.isError && posts.length > 0 ? (
        <div className="border-t border-border p-4">
          <ErrorState
            title="Could not load more"
            description={feedQuery.error instanceof Error ? feedQuery.error.message : "The next page did not load."}
            action={
              <Button type="button" variant="outline" onClick={() => void feedQuery.fetchNextPage()}>
                Retry
              </Button>
            }
          />
        </div>
      ) : null}
      {feedQuery.hasNextPage && !feedQuery.isFetchingNextPage ? (
        <div className="flex justify-center border-t border-border p-4">
          <Button type="button" variant="outline" onClick={() => void feedQuery.fetchNextPage()}>
            Load more
          </Button>
        </div>
      ) : null}
      {!feedQuery.hasNextPage ? (
        <p className="border-t border-border px-4 py-5 text-center text-metadata text-muted-foreground">
          You are all caught up.
        </p>
      ) : null}
    </section>
  );
}
