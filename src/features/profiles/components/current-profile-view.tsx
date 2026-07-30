"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/features/auth/hooks/use-auth-session";
import { ProfileHeader } from "@/features/profiles/components/profile-header";
import { ProfileRepostsList } from "@/features/profiles/components/profile-reposts-list";
import { mapAuthUserToProfile } from "@/features/profiles/utils/profile-mappers";
import { AppError } from "@/lib/api/api-error";

function ProfileSkeleton() {
  return (
    <>
      <PageHeader title="Profile" description="Your public profile" />
      <div className="border-b border-border px-4 pb-5">
        <Skeleton className="h-24 rounded-b-xl" />
        <div className="-mt-9 flex items-end justify-between">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </div>
    </>
  );
}

export function CurrentProfileView() {
  const currentUserQuery = useCurrentUserQuery();

  if (currentUserQuery.isPending) {
    return <ProfileSkeleton />;
  }

  if (currentUserQuery.isError) {
    const notFound = currentUserQuery.error instanceof AppError && currentUserQuery.error.status === 404;

    return (
      <>
        <PageHeader title="Profile" description="Your public profile" />
        <div className="p-4">
          {notFound ? (
            <EmptyState title="Profile not found" description="The current user profile could not be found." />
          ) : (
            <ErrorState
              title="Could not load profile"
              description={currentUserQuery.error instanceof Error ? currentUserQuery.error.message : "Try again."}
              action={
                <Button type="button" variant="outline" onClick={() => void currentUserQuery.refetch()}>
                  Retry
                </Button>
              }
            />
          )}
        </div>
      </>
    );
  }

  if (!currentUserQuery.data) {
    return (
      <>
        <PageHeader title="Profile" description="Your public profile" />
        <div className="p-4">
          <EmptyState title="Profile not found" description="Sign in again to reload your profile." />
        </div>
      </>
    );
  }

  const profile = mapAuthUserToProfile(currentUserQuery.data);

  return (
    <>
      <PageHeader title="Profile" description="Your public profile" />
      <ProfileHeader profile={profile} isOwner />
      <div className="border-b border-border">
        <div className="grid grid-cols-1">
          <div className="border-b-2 border-foreground px-4 py-3 text-center text-body-sm font-semibold text-foreground">
            Reposts
          </div>
        </div>
      </div>
      <ProfileRepostsList userId={profile.id} />
      <div className="border-t border-border p-4">
        <EmptyState
          title="Profile posts need API support"
          description="Posts, replies, and media tabs are not connected because profile-specific endpoints are not documented."
        />
      </div>
    </>
  );
}
