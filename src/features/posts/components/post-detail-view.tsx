"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { AppError } from "@/lib/api/api-error";

import { PostCard } from "@/features/posts/components/post-card";
import { PostSkeleton, PostSkeletonList } from "@/features/posts/components/post-skeleton";
import { usePostDetailQuery, usePostRepliesQuery } from "@/features/posts/hooks/use-post-detail-query";

interface PostDetailViewProps {
  postId: string;
}

function getErrorTitle(error: unknown) {
  if (error instanceof AppError && error.code === "NOT_FOUND") {
    return "Post not found";
  }

  return "Could not load this post";
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const postQuery = usePostDetailQuery(postId);
  const repliesQuery = usePostRepliesQuery(postId);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = repliesQuery;

  const replies = useMemo(() => repliesQuery.data?.pages.flatMap((page) => page.posts) ?? [], [repliesQuery.data]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (
      !element ||
      !hasNextPage ||
      isFetchingNextPage ||
      typeof IntersectionObserver === "undefined"
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "420px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <header className="sticky top-mobile-header z-20 flex h-14 items-center gap-3 border-b border-border bg-background/92 px-2 backdrop-blur md:top-0">
        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label="Go back"
          className="rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Button>
        <h1 className="text-page-title text-foreground">Post</h1>
      </header>

      <div className="px-3 pt-3 md:px-4">
        <section className="overflow-hidden rounded-t-xl border-x border-t border-border bg-surface" aria-label="Post detail content">
          {postQuery.isPending ? <PostSkeleton media /> : null}

          {postQuery.isError ? (
            <div className="p-4">
              <ErrorState
                title={getErrorTitle(postQuery.error)}
                description={postQuery.error instanceof Error ? postQuery.error.message : "Try opening the post again."}
                action={
                  <Button type="button" variant="outline" onClick={() => void postQuery.refetch()}>
                    Retry
                  </Button>
                }
              />
            </div>
          ) : null}

          {postQuery.data ? <PostCard post={postQuery.data} variant="detail" showConnector={replies.length > 0} /> : null}

          {postQuery.data ? (
            <section aria-label="Replies">
              {repliesQuery.isPending ? <PostSkeletonList /> : null}
              {repliesQuery.isError && replies.length === 0 ? (
                <div className="p-4">
                  <ErrorState
                    title="Could not load replies"
                    description={repliesQuery.error instanceof Error ? repliesQuery.error.message : "Try loading replies again."}
                    action={
                      <Button type="button" variant="outline" onClick={() => void repliesQuery.refetch()}>
                        Retry
                      </Button>
                    }
                  />
                </div>
              ) : null}
              {!repliesQuery.isPending && !repliesQuery.isError && replies.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No replies yet" description="Replies will appear here when the API returns them." />
                </div>
              ) : null}
              {replies.map((reply, index) => (
                <PostCard key={`${reply.id}-${index}`} post={reply} variant="reply" showConnector={index < replies.length - 1} />
              ))}
              <div ref={loadMoreRef} className="min-h-1" aria-hidden="true" />
              {repliesQuery.isFetchingNextPage ? <PostSkeleton className="border-b-0" /> : null}
              {repliesQuery.hasNextPage && !repliesQuery.isFetchingNextPage ? (
                <div className="flex justify-center border-t border-border p-4">
                  <Button type="button" variant="outline" onClick={() => void repliesQuery.fetchNextPage()}>
                    Load more replies
                  </Button>
                </div>
              ) : null}
            </section>
          ) : null}
        </section>
      </div>
    </>
  );
}
