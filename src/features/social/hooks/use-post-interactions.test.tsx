import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLikePostMutation } from "@/features/social/hooks/use-post-interactions";
import type { PaginatedPosts, Post } from "@/features/posts/types/post-types";
import { createQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";

const socialServiceMocks = vi.hoisted(() => ({
  likePost: vi.fn(),
}));

vi.mock("@/services/SocialService", () => ({
  SocialService: {
    likePost: socialServiceMocks.likePost,
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

function createPost(overrides: Partial<Post> = {}): Post {
  return {
    id: "post-1",
    author: {
      id: "user-1",
      name: "Le Tien Dat",
      username: "letiendat",
      isVerified: false,
    },
    content: "Post content",
    media: [],
    counts: {
      replies: 0,
      reposts: 0,
      likes: 0,
    },
    isLiked: false,
    isReposted: false,
    isSaved: false,
    isHidden: false,
    isDeleted: false,
    isUnavailable: false,
    ...overrides,
  };
}

function createWrapper(queryClient: ReturnType<typeof createQueryClient>) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return Wrapper;
}

function seedPost(queryClient: ReturnType<typeof createQueryClient>, post: Post) {
  queryClient.setQueryData(queryKeys.posts.detail(post.id), post);
  queryClient.setQueryData(
    queryKeys.feed.type("for_you", { perPage: 20 }),
    {
      pages: [
        {
          posts: [post],
          pageInfo: {
            currentPage: 1,
            perPage: 20,
            hasNextPage: false,
          },
        },
      ],
      pageParams: [1],
    } satisfies { pages: PaginatedPosts[]; pageParams: number[] },
  );
}

describe("useLikePostMutation", () => {
  beforeEach(() => {
    socialServiceMocks.likePost.mockReset();
  });

  it("optimistically likes a post and keeps cache consistent on success", async () => {
    socialServiceMocks.likePost.mockResolvedValueOnce({});
    const queryClient = createQueryClient();
    const post = createPost();
    seedPost(queryClient, post);
    const { result } = renderHook(() => useLikePostMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ postId: post.id });

    await waitFor(() => {
      expect(queryClient.getQueryData<Post>(queryKeys.posts.detail(post.id))).toMatchObject({
        isLiked: true,
        counts: { likes: 1 },
      });
    });

    const feed = queryClient.getQueryData<{ pages: PaginatedPosts[] }>(queryKeys.feed.type("for_you", { perPage: 20 }));
    expect(feed?.pages[0]?.posts[0]).toMatchObject({
      isLiked: true,
      counts: { likes: 1 },
    });
  });

  it("rolls back when like fails", async () => {
    socialServiceMocks.likePost.mockRejectedValueOnce(new Error("Nope"));
    const queryClient = createQueryClient();
    const post = createPost({ counts: { replies: 0, reposts: 0, likes: 4 } });
    seedPost(queryClient, post);
    const { result } = renderHook(() => useLikePostMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ postId: post.id });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(queryClient.getQueryData<Post>(queryKeys.posts.detail(post.id))).toMatchObject({
      isLiked: false,
      counts: { likes: 4 },
    });
  });

  it("unlikes without allowing a negative count", async () => {
    socialServiceMocks.likePost.mockResolvedValueOnce({});
    const queryClient = createQueryClient();
    const post = createPost({ isLiked: true, counts: { replies: 0, reposts: 0, likes: 0 } });
    seedPost(queryClient, post);
    const { result } = renderHook(() => useLikePostMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ postId: post.id });

    await waitFor(() => {
      expect(queryClient.getQueryData<Post>(queryKeys.posts.detail(post.id))).toMatchObject({
        isLiked: false,
        counts: { likes: 0 },
      });
    });
  });
});
