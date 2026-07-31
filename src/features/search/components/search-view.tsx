"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FollowButton } from "@/components/shared/follow-button";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";
import { UserName } from "@/components/shared/user-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchQuery } from "@/features/search/hooks/use-search-query";
import { SEARCH_MIN_QUERY_LENGTH, SearchService } from "@/services/SearchService";
import { useQuery } from "@tanstack/react-query";

function SearchSkeleton() {
  return (
    <div className="space-y-3 p-4" role="status" aria-label="Loading search results">
      <Skeleton className="h-12 rounded-lg" />
      <Skeleton className="h-12 rounded-lg" />
      <Skeleton className="h-12 rounded-lg" />
    </div>
  );
}

export function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const initialKeyword = searchParams.get("q") ?? "";
  const [keyword, setKeyword] = useState(initialKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(initialKeyword.trim());
  const searchQuery = useSearchQuery(debouncedKeyword);
  const trimmedKeyword = keyword.trim();
  const hasSearchableKeyword = debouncedKeyword.length >= SEARCH_MIN_QUERY_LENGTH;

  const { data, isLoading } = useQuery({
    queryKey: ["sugggestions"],
    queryFn: async () => {
      const res = await SearchService.getSuggestions();
      return res?.data;
    }
  });

  const sugggestions = data?.data;


  useEffect(() => {
    setKeyword(initialKeyword);
    setDebouncedKeyword(initialKeyword.trim());
  }, [initialKeyword]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextKeyword = keyword.trim();
      const params = new URLSearchParams(searchParamsString);

      if (nextKeyword) {
        params.set("q", nextKeyword);
      } else {
        params.delete("q");
      }

      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
      setDebouncedKeyword(nextKeyword);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [keyword, pathname, router, searchParamsString]);

  const resultsCount = useMemo(() => {
    if (!searchQuery.data) {
      return 0;
    }

    return searchQuery.data.users.length + searchQuery.data.topics.length;
  }, [searchQuery.data]);

  function clearSearch() {
    setKeyword("");
    setDebouncedKeyword("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
      <PageHeader title="Search" description="Find people and topics" />
      <div className="border-b border-border p-4">
        <label className="relative block">
          <span className="sr-only">Search keyword</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="rounded-full bg-surface pl-9 pr-10"
            placeholder="Search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          {keyword ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={clearSearch}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </label>
      </div>

      {!trimmedKeyword ? (
        sugggestions?.map((sugggestion: any) => {
          return (
            <article key={`user-${sugggestion.id}`} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar name={sugggestion.name} src={sugggestion.avatarUrl} size="md" />
              <div className="min-w-0 flex-1">
                <UserName name={sugggestion.name} username={sugggestion.username} verified={sugggestion.isVerified} />
                {sugggestion.bio ? <p className="mt-1 line-clamp-2 text-body-sm text-muted-foreground">{sugggestion.bio}</p> : null}
              </div>
              <FollowButton userId={sugggestion.id} following={sugggestion.isFollowing} />
            </article>
          )
        })
      ) : null}

      {trimmedKeyword && trimmedKeyword.length < SEARCH_MIN_QUERY_LENGTH ? (
        <div className="p-4">
          <EmptyState title="Keep typing" description="Search starts after at least two characters." />
        </div>
      ) : null}

      {hasSearchableKeyword && searchQuery.isPending ? <SearchSkeleton /> : null}

      {hasSearchableKeyword && searchQuery.isError ? (
        <div className="p-4">
          <ErrorState
            title="Could not search"
            description={searchQuery.error instanceof Error ? searchQuery.error.message : "Try again."}
            action={
              <Button type="button" variant="outline" onClick={() => void searchQuery.refetch()}>
                Retry
              </Button>
            }
          />
        </div>
      ) : null}

      {hasSearchableKeyword && searchQuery.data && resultsCount === 0 ? (
        <div className="p-4">
          <EmptyState title="No results" description={`No people or topics found for "${debouncedKeyword}".`} />
        </div>
      ) : null}

      {hasSearchableKeyword && searchQuery.data && resultsCount > 0 ? (
        <div className="divide-y divide-border">
          {searchQuery.data.users.map((user) => (
            <article key={`user-${user.id}`} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar name={user.name} src={user.avatarUrl} size="md" />
              <div className="min-w-0 flex-1">
                <UserName name={user.name} username={user.username} verified={user.isVerified} />
                {user.bio ? <p className="mt-1 line-clamp-2 text-body-sm text-muted-foreground">{user.bio}</p> : null}
              </div>
              <FollowButton userId={user.id} following={user.isFollowing} />
            </article>
          ))}
          {searchQuery.data.topics.map((topic) => (
            <article key={`topic-${topic.id}`} className="px-4 py-3">
              <p className="text-display-name text-foreground">#{topic.name.replace(/^#/, "")}</p>
              {typeof topic.postsCount === "number" ? (
                <p className="text-metadata text-muted-foreground">{topic.postsCount} posts</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
}
