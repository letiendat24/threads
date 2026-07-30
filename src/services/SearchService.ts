import { mapSearchResults } from "@/features/search/utils/search-mappers";
import { axiosClient } from "@/lib/api/axios-client";

import type { SearchRequest } from "@/features/search/types/search-types";

type ApiEnvelope<T> = T | { data: T; message?: string; status?: string };

export const SEARCH_MIN_QUERY_LENGTH = 2;

export class SearchService {
  static async search({ q, page = 1, perPageTopics = 10, perPageUsers = 10, signal }: SearchRequest) {
    const response = await axiosClient.get<ApiEnvelope<unknown>>("/api/search", {
      params: {
        q,
        page,
        per_page_topics: perPageTopics,
        per_page_users: perPageUsers,
      },
      signal,
    });

    return mapSearchResults(response.data);
  }
}
