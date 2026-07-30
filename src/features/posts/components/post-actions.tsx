"use client";

import { Bookmark, Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLikePostMutation, useRepostPostMutation, useSavePostMutation } from "@/features/social/hooks/use-post-interactions";
import { sharePostLink } from "@/features/social/utils/share-post";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

import type { Post } from "@/features/posts/types/post-types";

interface PostActionsProps {
  post: Post;
  compact?: boolean;
}

function formatCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  }

  return value > 0 ? String(value) : "";
}

export function PostActions({ post, compact = false }: PostActionsProps) {
  const openComposer = useUiStore((state) => state.openComposer);
  const likeMutation = useLikePostMutation();
  const repostMutation = useRepostPostMutation();
  const saveMutation = useSavePostMutation();

  const isInteracting = likeMutation.isPending || repostMutation.isPending || saveMutation.isPending;

  async function handleShare() {
    try {
      const result = await sharePostLink(`${window.location.origin}/post/${post.id}`);
      toast.success(result === "shared" ? "Shared." : "Link copied.");
    } catch {
      toast.error("Could not share this post.");
    }
  }

  const actions = [
    {
      kind: "reply",
      label: "Reply",
      icon: MessageCircle,
      count: post.counts.replies,
      active: false,
      onClick: () => openComposer("reply", { postId: post.id }),
      disabled: false,
    },
    {
      kind: "repost",
      label: post.isReposted ? "Reposted" : "Repost",
      icon: Repeat2,
      count: post.counts.reposts,
      active: post.isReposted,
      onClick: () => {
        if (!repostMutation.isPending) {
          repostMutation.mutate({ postId: post.id });
        }
      },
      disabled: isInteracting,
    },
    {
      kind: "like",
      label: post.isLiked ? "Liked" : "Like",
      icon: Heart,
      count: post.counts.likes,
      active: post.isLiked,
      onClick: () => {
        if (!likeMutation.isPending) {
          likeMutation.mutate({ postId: post.id });
        }
      },
      disabled: isInteracting,
    },
    {
      kind: "save",
      label: post.isSaved ? "Saved" : "Save",
      icon: Bookmark,
      count: 0,
      active: post.isSaved,
      onClick: () => {
        if (!saveMutation.isPending) {
          saveMutation.mutate({ postId: post.id });
        }
      },
      disabled: isInteracting,
    },
    {
      kind: "share",
      label: "Share",
      icon: Send,
      count: 0,
      active: false,
      onClick: () => void handleShare(),
      disabled: false,
    },
  ] as const;

  return (
    <div className={cn("flex items-center gap-1.5 text-muted-foreground", compact ? "mt-2" : "mt-3")}>
      {actions.map(({ kind, label, icon: Icon, count, active, onClick, disabled }) => (
        <Button
          key={label}
          type="button"
          variant="icon"
          size="sm"
          aria-label={label}
          className={cn(
            "h-8 min-w-8 gap-1 rounded-full px-2 text-muted-foreground hover:text-foreground",
            active && kind !== "like" && "text-foreground",
            active && kind === "like" && "text-destructive hover:text-destructive",
          )}
          onClick={onClick}
          disabled={disabled}
          aria-pressed={kind === "like" || kind === "repost" || kind === "save" ? active : undefined}
        >
          <Icon
            className={cn(
              "size-[18px]",
              kind === "like" && "stroke-[2.15]",
              kind === "like" && active && "fill-destructive",
            )}
            aria-hidden="true"
          />
          {count > 0 ? <span className="text-counter">{formatCount(count)}</span> : null}
        </Button>
      ))}
    </div>
  );
}
