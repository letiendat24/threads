import { mapPaginatedPosts } from "@/features/posts/api/post-mappers";
import type { PaginatedPosts } from "@/features/posts/types/post-types";
import { axiosClient } from "@/lib/api/axios-client";

import type { FeedType } from "@/features/feed/types/feed-types";

export interface FeedRequest {
  type: FeedType;
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
}

export class FeedService {
  static async getFeed(request: FeedRequest): Promise<PaginatedPosts> {
    const page = request.page ?? 1;
    const perPage = request.perPage ?? 20;

    const response = await axiosClient.get<unknown>("/api/posts/feed", {
      params: {
        type: request.type,
        page,
        per_page: perPage,
      },
      signal: request.signal,
    });

    return mapPaginatedPosts(response.data, page, perPage);
  }
}
