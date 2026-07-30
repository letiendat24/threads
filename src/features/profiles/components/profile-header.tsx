"use client";

import { CalendarDays, Link as LinkIcon, Lock, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { FollowButton } from "@/components/shared/follow-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { UserName } from "@/components/shared/user-name";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditProfileDialog } from "@/features/profiles/components/edit-profile-dialog";
import { ProfileConnectionsDialog } from "@/features/profiles/components/profile-connections-dialog";
import { copyTextToClipboard } from "@/features/social/utils/share-post";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";

import type { UserProfile } from "@/features/profiles/types/profile-types";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwner?: boolean;
}

export function ProfileHeader({ profile, isOwner = false }: ProfileHeaderProps) {
  async function handleCopyProfileLink() {
    try {
      await copyTextToClipboard(`${window.location.origin}/profile`);
      toast.success("Profile link copied.");
    } catch {
      toast.error("Could not copy profile link.");
    }
  }

  return (
    <section className="border-b border-border bg-background px-4 pb-5">
      <div className="h-24 rounded-b-xl bg-surface" aria-hidden="true" />
      <div className="-mt-9 flex items-end justify-between gap-4">
        <UserAvatar name={profile.name} src={profile.avatarUrl} size="xl" className="ring-4 ring-background" />
        <div className="flex items-center gap-2">
          {isOwner ? <EditProfileDialog profile={profile} /> : <FollowButton userId={profile.id} following={profile.isFollowing} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="icon" size="sm" aria-label="More profile options">
                <MoreHorizontal className="size-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => void handleCopyProfileLink()}>Copy profile link</DropdownMenuItem>
              {isOwner ? <DropdownMenuItem disabled>Public profile endpoint unavailable</DropdownMenuItem> : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <UserName name={profile.name} username={profile.username} verified={profile.isVerified} />
        {profile.bio ? <p className="whitespace-pre-wrap text-body text-foreground">{profile.bio}</p> : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-metadata text-muted-foreground">
          {profile.link ? (
            <a className="inline-flex items-center gap-1 hover:underline" href={profile.link} rel="noreferrer" target="_blank">
              <LinkIcon className="size-3.5" aria-hidden="true" />
              {profile.link}
            </a>
          ) : null}
          {profile.isPrivate ? (
            <span className="inline-flex items-center gap-1">
              <Lock className="size-3.5" aria-hidden="true" />
              Private
            </span>
          ) : null}
          {profile.createdAt ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Joined {formatRelativeTime(profile.createdAt)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <ProfileConnectionsDialog userId={profile.id} type="followers" count={profile.followersCount} />
          <ProfileConnectionsDialog userId={profile.id} type="following" count={profile.followingCount} />
        </div>
      </div>
    </section>
  );
}
