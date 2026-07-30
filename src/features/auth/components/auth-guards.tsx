"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { PageSkeleton } from "@/components/shared/page-skeleton";
import { clearAuthTokens, getAccessToken } from "@/lib/api/auth-token-storage";

import { useCurrentUserQuery } from "@/features/auth/hooks/use-auth-session";

export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathnameSearchParams = useSearchParams();
  const hasToken = Boolean(getAccessToken());
  const currentUserQuery = useCurrentUserQuery();

  useEffect(() => {
    if (!hasToken) {
      const next = pathnameSearchParams.toString();
      router.replace(next ? `/login?next=/?${next}` : "/login");
    }
  }, [hasToken, pathnameSearchParams, router]);

  useEffect(() => {
    if (currentUserQuery.isError) {
      clearAuthTokens();
      router.replace("/login");
    }
  }, [currentUserQuery.isError, router]);

  if (!hasToken || currentUserQuery.isLoading || currentUserQuery.isError) {
    return <PageSkeleton />;
  }

  return children;
}

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasToken = Boolean(getAccessToken());

  useEffect(() => {
    if (hasToken) {
      router.replace("/");
    }
  }, [hasToken, router]);

  if (hasToken) {
    return <PageSkeleton />;
  }

  return children;
}
