"use client";

import { UserAvatar } from "@/components/shared/user-avatar";
import { UserName } from "@/components/shared/user-name";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/features/auth/hooks/use-auth-session";

export function SessionSummary() {
  const currentUserQuery = useCurrentUserQuery();
  const user = currentUserQuery.data;
  const displayName = user?.name ?? user?.username ?? "Current user";
  const username = user?.username ?? undefined;
  const avatar = user?.avatar ?? undefined;

  if (currentUserQuery.isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={displayName} src={avatar} />
      <UserName name={displayName} username={username} />
    </div>
  );
}
