import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";

import { PostActions } from "@/features/posts/components/post-actions";
import { PostContent } from "@/features/posts/components/post-content";
import { PostHeader } from "@/features/posts/components/post-header";
import { PostMedia } from "@/features/posts/components/post-media";
import { QuotedPostPreview } from "@/features/posts/components/quoted-post-preview";
import type { Post } from "@/features/posts/types/post-types";

interface PostCardProps {
  post: Post;
  variant?: "feed" | "detail" | "reply";
  showConnector?: boolean;
}

export function PostCard({ post, variant = "feed", showConnector = true }: PostCardProps) {
  const isDetail = variant === "detail";

  if (post.isDeleted || post.isUnavailable) {
    return (
      <div className="border-b border-border px-4 py-4">
        <EmptyState
          title="Post unavailable"
          description="This post may have been deleted or is no longer available."
          className="rounded-lg bg-background py-5"
        />
      </div>
    );
  }

  const hasBody = post.content.trim().length > 0 || post.media.length > 0;
  const body = (
    <>
      <PostContent content={post.content} className={post.media.length > 0 ? "mt-2" : "mt-1.5"} />
      <PostMedia media={post.media} />
    </>
  );

  return (
    <article
      className={cn(
        "group border-b border-border bg-surface transition-colors",
        !isDetail && "hover:bg-surface-hover",
        variant === "reply" ? "px-4 py-3" : "px-4 py-4",
      )}
    >
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
        <div className="flex flex-col items-center">
          <UserAvatar
            name={post.author.name}
            src={post.author.avatarUrl}
            size={isDetail ? "lg" : "md"}
            className="shrink-0"
          />
          {showConnector ? <div className="mt-2 min-h-6 w-px flex-1 bg-border" aria-hidden="true" /> : null}
        </div>
        <div className="min-w-0">
          <PostHeader post={post} />
          {isDetail ? (
            <>
              {hasBody ? <div className="mt-2">{body}</div> : null}
              {post.quotedPost ? <QuotedPostPreview post={post.quotedPost} /> : null}
            </>
          ) : (
            <>
              {hasBody ? (
                <Link
                  href={`/post/${post.id}`}
                  className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {body}
                </Link>
              ) : null}
              {post.quotedPost ? <QuotedPostPreview post={post.quotedPost} /> : null}
            </>
          )}
          <PostActions post={post} compact={variant === "reply"} />
        </div>
      </div>
    </article>
  );
}
