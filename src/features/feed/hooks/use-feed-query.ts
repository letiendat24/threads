"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { FEED_PAGE_SIZE, type FeedType } from "@/features/feed/types/feed-types";
import { queryKeys } from "@/lib/query/query-keys";
import { FeedService } from "@/services/FeedService";

export function useFeedQuery(type: FeedType) {
  return useInfiniteQuery({
    queryKey: queryKeys.feed.type(type, { perPage: FEED_PAGE_SIZE }),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      FeedService.getFeed({
        type,
        page: pageParam,
        perPage: FEED_PAGE_SIZE,
        signal,
      }),
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
  });
}
