"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { SEARCH_MIN_QUERY_LENGTH, SearchService } from "@/services/SearchService";

export function useSearchQuery(keyword: string) {
  const q = keyword.trim();

  return useQuery({
    queryKey: queryKeys.search.results({
      q,
      page: 1,
      perPageTopics: 10,
      perPageUsers: 10,
    }),
    queryFn: ({ signal }) =>
      SearchService.search({
        q,
        page: 1,
        perPageTopics: 10,
        perPageUsers: 10,
        signal,
      }),
    enabled: q.length >= SEARCH_MIN_QUERY_LENGTH,
  });
}
