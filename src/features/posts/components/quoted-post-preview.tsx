import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { PostContent } from "@/features/posts/components/post-content";
import { PostMedia } from "@/features/posts/components/post-media";
import type { Post } from "@/features/posts/types/post-types";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";

interface QuotedPostPreviewProps {
  post: Post;
}

export function QuotedPostPreview({ post }: QuotedPostPreviewProps) {
  const timestamp = post.createdAt ? formatRelativeTime(post.createdAt) : undefined;

  if (post.isDeleted || post.isUnavailable) {
    return (
      <div className="mt-3 rounded-lg border border-border bg-surface-raised p-3">
        <EmptyState
          title="Post unavailable"
          description="This post may have been deleted or is no longer available."
          className="border-0 bg-transparent p-3"
        />
      </div>
    );
  }

  return (
    <Link
      href={`/post/${post.id}`}
      className="mt-3 block rounded-lg border border-border bg-surface-raised p-3 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <div className="flex min-w-0 items-center gap-2">
        <UserAvatar name={post.author.name} src={post.author.avatarUrl} size="sm" className="shrink-0" />
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-display-name text-foreground">{post.author.name}</span>
          {post.author.isVerified ? <VerifiedBadge /> : null}
          {timestamp ? (
            <time className="shrink-0 text-metadata text-muted-foreground" dateTime={post.createdAt}>
              {timestamp}
            </time>
          ) : null}
        </div>
      </div>
      <PostContent content={post.content} className="mt-2 text-body-sm" />
      <PostMedia media={post.media} />
    </Link>
  );
}
