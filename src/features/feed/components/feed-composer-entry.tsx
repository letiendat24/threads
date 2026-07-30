"use client";

import { ImagePlus } from "lucide-react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/features/auth/hooks/use-auth-session";
import type { AuthUser } from "@/features/auth/types/auth-types";
import { useUiStore } from "@/stores/ui-store";

function getUserDisplayName(user?: AuthUser) {
  return user?.name ?? user?.username ?? "You";
}

function getUserAvatar(user?: AuthUser) {
  const avatar = user?.avatar ?? user?.avatar_url ?? user?.profile_photo_url;
  return typeof avatar === "string" ? avatar : undefined;
}

export function FeedComposerEntry() {
  const currentUserQuery = useCurrentUserQuery();
  const openComposer = useUiStore((state) => state.openComposer);

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
        <UserAvatar
          name={getUserDisplayName(currentUserQuery.data)}
          src={getUserAvatar(currentUserQuery.data)}
          size="md"
          className="shrink-0"
        />
        <div className="flex min-w-0 items-center justify-between gap-3">
          <button
            type="button"
            className="min-w-0 flex-1 rounded-md py-2 text-left text-body text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => openComposer("post")}
          >
            Start a thread...
          </button>
          <Button
            type="button"
            variant="icon"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Create post with media"
            onClick={() => openComposer("post")}
          >
            <ImagePlus className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
