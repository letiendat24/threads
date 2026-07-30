"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ErrorState } from "@/components/shared/error-state";
import { FollowButton } from "@/components/shared/follow-button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { UserAvatar } from "@/components/shared/user-avatar";
import { UserName } from "@/components/shared/user-name";
import { Button } from "@/components/ui/button";
import { useProfileConnectionsQuery } from "@/features/profiles/hooks/use-profile-query";

import type { ProfileConnectionType } from "@/features/profiles/types/profile-types";

interface ProfileConnectionsDialogProps {
  userId: string;
  type: ProfileConnectionType;
  count?: number;
}

function titleForType(type: ProfileConnectionType) {
  return type === "followers" ? "Followers" : "Following";
}

export function ProfileConnectionsDialog({ userId, type, count }: ProfileConnectionsDialogProps) {
  const connectionsQuery = useProfileConnectionsQuery(userId, type);
  const title = titleForType(type);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-sm text-body-sm text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="font-semibold">{count ?? 0}</span>{" "}
          <span className="text-muted-foreground">{title.toLowerCase()}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>People connected to this profile.</DialogDescription>
        </DialogHeader>
        {connectionsQuery.isPending ? (
          <div className="flex justify-center py-8" role="status" aria-label={`Loading ${title.toLowerCase()}`}>
            <LoadingSpinner />
          </div>
        ) : null}
        {connectionsQuery.isError ? (
          <ErrorState
            title={`Could not load ${title.toLowerCase()}`}
            description={connectionsQuery.error instanceof Error ? connectionsQuery.error.message : "Try again."}
            action={
              <Button type="button" variant="outline" onClick={() => void connectionsQuery.refetch()}>
                Retry
              </Button>
            }
          />
        ) : null}
        {connectionsQuery.data && connectionsQuery.data.length === 0 ? (
          <p className="rounded-lg border border-border bg-background p-4 text-center text-body-sm text-muted-foreground">
            No {title.toLowerCase()} yet.
          </p>
        ) : null}
        {connectionsQuery.data && connectionsQuery.data.length > 0 ? (
          <ul className="divide-y divide-border">
            {connectionsQuery.data.map((user) => (
              <li key={user.id} className="flex items-center gap-3 py-3">
                <UserAvatar name={user.name} src={user.avatarUrl} size="sm" />
                <UserName name={user.name} username={user.username} verified={user.isVerified} className="flex-1" />
                {user.id !== userId ? <FollowButton userId={user.id} following={user.isFollowing} /> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
