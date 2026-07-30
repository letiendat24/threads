import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

import type { PaginatedPosts, Post } from "@/features/posts/types/post-types";
import { queryKeys } from "@/lib/query/query-keys";

function hasUsablePostId(post: Post) {
  return post.id.length > 0 && post.id !== "unavailable";
}

function postExists(posts: Post[], postId: string) {
  return posts.some((post) => post.id === postId);
}

function updatePostInPage(page: PaginatedPosts, postId: string, updater: (post: Post) => Post | undefined) {
  return {
    ...page,
    posts: page.posts.flatMap((post) => {
      if (post.id !== postId) {
        return [post];
      }

      const nextPost = updater(post);
      return nextPost ? [nextPost] : [];
    }),
  };
}

function updateInfinitePosts(
  data: InfiniteData<PaginatedPosts> | undefined,
  postId: string,
  updater: (post: Post) => Post | undefined,
) {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => updatePostInPage(page, postId, updater)),
  };
}

function isRepliesQueryKey(queryKey: QueryKey) {
  return Array.isArray(queryKey) && queryKey[0] === "posts" && queryKey.includes("replies");
}

function updatePostInInfiniteCaches(queryClient: QueryClient, postId: string, updater: (post: Post) => Post | undefined) {
  queryClient.setQueriesData<InfiniteData<PaginatedPosts>>({ queryKey: queryKeys.feed.all }, (data) =>
    updateInfinitePosts(data, postId, updater),
  );
  queryClient.setQueriesData<InfiniteData<PaginatedPosts>>({ predicate: ({ queryKey }) => isRepliesQueryKey(queryKey) }, (data) =>
    updateInfinitePosts(data, postId, updater),
  );
}

export type PostInteractionSnapshot = {
  detail: Post | undefined;
  feedCollections: Array<[QueryKey, InfiniteData<PaginatedPosts> | undefined]>;
  replyCollections: Array<[QueryKey, InfiniteData<PaginatedPosts> | undefined]>;
};

export function snapshotPostInteraction(queryClient: QueryClient, postId: string): PostInteractionSnapshot {
  return {
    detail: queryClient.getQueryData<Post>(queryKeys.posts.detail(postId)),
    feedCollections: queryClient.getQueriesData<InfiniteData<PaginatedPosts>>({ queryKey: queryKeys.feed.all }),
    replyCollections: queryClient.getQueriesData<InfiniteData<PaginatedPosts>>({
      predicate: ({ queryKey }) => isRepliesQueryKey(queryKey),
    }),
  };
}

export function restorePostInteraction(queryClient: QueryClient, snapshot: PostInteractionSnapshot, postId: string) {
  queryClient.setQueryData(queryKeys.posts.detail(postId), snapshot.detail);

  for (const [queryKey, data] of [...snapshot.feedCollections, ...snapshot.replyCollections]) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function insertPostIntoFeedCaches(queryClient: QueryClient, post: Post) {
  if (!hasUsablePostId(post)) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    return;
  }

  queryClient.setQueriesData<InfiniteData<PaginatedPosts>>({ queryKey: queryKeys.feed.all }, (data) => {
    if (!data || data.pages.length === 0) {
      return data;
    }

    const [firstPage, ...restPages] = data.pages;
    if (!firstPage || postExists(firstPage.posts, post.id)) {
      return data;
    }

    return {
      ...data,
      pages: [
        {
          ...firstPage,
          posts: [post, ...firstPage.posts],
        },
        ...restPages,
      ],
    };
  });
}

export function insertReplyIntoCaches(queryClient: QueryClient, parentPostId: string, reply: Post) {
  if (hasUsablePostId(reply)) {
    queryClient.setQueriesData<InfiniteData<PaginatedPosts>>(
      { queryKey: queryKeys.posts.repliesRoot(parentPostId) },
      (data) => {
        if (!data || data.pages.length === 0) {
          return data;
        }

        const [firstPage, ...restPages] = data.pages;
        if (!firstPage || postExists(firstPage.posts, reply.id)) {
          return data;
        }

        return {
          ...data,
          pages: [
            {
              ...firstPage,
              posts: [reply, ...firstPage.posts],
            },
            ...restPages,
          ],
        };
      },
    );
  } else {
    void queryClient.invalidateQueries({ queryKey: queryKeys.posts.repliesRoot(parentPostId) });
  }

  updatePostAcrossCaches(queryClient, parentPostId, (post) => ({
    ...post,
    counts: {
      ...post.counts,
      replies: post.counts.replies + 1,
    },
  }));
}

export function replacePostAcrossCaches(queryClient: QueryClient, post: Post) {
  if (!hasUsablePostId(post)) {
    return;
  }

  queryClient.setQueryData<Post>(queryKeys.posts.detail(post.id), post);
  updatePostInInfiniteCaches(queryClient, post.id, () => post);
}

export function removePostAcrossCaches(queryClient: QueryClient, postId: string) {
  queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
  updatePostInInfiniteCaches(queryClient, postId, () => undefined);
}

export function updatePostAcrossCaches(queryClient: QueryClient, postId: string, updater: (post: Post) => Post) {
  queryClient.setQueryData<Post>(queryKeys.posts.detail(postId), (post) => (post ? updater(post) : post));
  updatePostInInfiniteCaches(queryClient, postId, updater);
}
