"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/query-keys";
import { PostService } from "@/services/PostService";

const REPLIES_PAGE_SIZE = 20;

export function usePostDetailQuery(postId: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: ({ signal }) => PostService.getPost(postId, signal),
    enabled: postId.length > 0,
  });
}

export function usePostRepliesQuery(postId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.replies(postId, { perPage: REPLIES_PAGE_SIZE }),
    initialPageParam: 1,
    enabled: postId.length > 0,
    queryFn: ({ pageParam, signal }) =>
      PostService.getPostReplies(postId, {
        page: pageParam,
        perPage: REPLIES_PAGE_SIZE,
        signal,
      }),
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
  });
}
