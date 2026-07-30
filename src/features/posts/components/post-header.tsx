"use client";

import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { UserAvatar } from "@/components/shared/user-avatar";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserQuery } from "@/features/auth/hooks/use-auth-session";
import { useDeletePostMutation } from "@/features/posts/hooks/use-post-mutations";
import { ReportPostDialog } from "@/features/social/components/report-post-dialog";
import { useBlockUserMutation, useMuteUserMutation } from "@/features/social/hooks/use-follow-interactions";
import { useHidePostMutation } from "@/features/social/hooks/use-post-interactions";
import { copyTextToClipboard } from "@/features/social/utils/share-post";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";
import { useUiStore } from "@/stores/ui-store";

import type { Post } from "@/features/posts/types/post-types";

interface PostHeaderProps {
  post: Post;
  showAvatar?: boolean;
  showMenu?: boolean;
}

export function PostHeader({ post, showAvatar = false, showMenu = true }: PostHeaderProps) {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isReportOpen, setReportOpen] = useState(false);
  const openComposer = useUiStore((state) => state.openComposer);
  const currentUserQuery = useCurrentUserQuery();
  const deletePostMutation = useDeletePostMutation(post.id);
  const hidePostMutation = useHidePostMutation();
  const muteUserMutation = useMuteUserMutation();
  const blockUserMutation = useBlockUserMutation();
  const timestamp = post.createdAt ? formatRelativeTime(post.createdAt) : undefined;
  const canManagePost = String(currentUserQuery.data?.id ?? "") === post.author.id;
  const isMenuActionPending =
    deletePostMutation.isPending ||
    hidePostMutation.isPending ||
    muteUserMutation.isPending ||
    blockUserMutation.isPending;

  async function handleCopyLink() {
    try {
      await copyTextToClipboard(`${window.location.origin}/post/${post.id}`);
      toast.success("Link copied.");
    } catch {
      toast.error("Could not copy link.");
    }
  }

  return (
    <>
      <div className="flex min-w-0 items-start gap-3">
        {showAvatar ? <UserAvatar name={post.author.name} src={post.author.avatarUrl} size="md" className="shrink-0" /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-display-name text-foreground">{post.author.name}</span>
            {post.author.isVerified ? <VerifiedBadge /> : null}
            <span className="truncate text-username text-muted-foreground">@{post.author.username}</span>
            {timestamp ? (
              <>
                <span className="text-metadata text-muted-foreground" aria-hidden="true">
                  ·
                </span>
                <time className="shrink-0 text-metadata text-muted-foreground" dateTime={post.createdAt}>
                  {timestamp}
                </time>
              </>
            ) : null}
          </div>
          {post.topicName ? <p className="mt-0.5 text-metadata text-muted-foreground">{post.topicName}</p> : null}
        </div>
        {showMenu ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="icon"
                size="sm"
                aria-label="More post options"
                className="-mr-2 -mt-1 rounded-full text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="size-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => void handleCopyLink()}>Copy link</DropdownMenuItem>
              {canManagePost ? (
                <>
                  <DropdownMenuItem onSelect={() => openComposer("edit", { postId: post.id })}>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onSelect={() => setDeleteConfirmOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuItem
                disabled={isMenuActionPending}
                onSelect={() => hidePostMutation.mutate({ postId: post.id })}
              >
                Hide post
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isMenuActionPending} onSelect={() => setReportOpen(true)}>
                Report post
              </DropdownMenuItem>
              {!canManagePost ? (
                <>
                  <DropdownMenuItem
                    disabled={isMenuActionPending}
                    onSelect={() => muteUserMutation.mutate(post.author.id)}
                  >
                    Mute @{post.author.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    disabled={isMenuActionPending}
                    onSelect={() => blockUserMutation.mutate(post.author.id)}
                  >
                    Block @{post.author.username}
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>This post will be removed from your visible feeds.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePostMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletePostMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                deletePostMutation.mutate(undefined, {
                  onSuccess: () => setDeleteConfirmOpen(false),
                });
              }}
            >
              {deletePostMutation.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReportPostDialog open={isReportOpen} postId={post.id} onOpenChange={setReportOpen} />
    </>
  );
}
