import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { PostDetailView } from "@/features/posts/components/post-detail-view";
import type { PaginatedPosts, Post } from "@/features/posts/types/post-types";
import { AppError } from "@/lib/api/api-error";
import { createQueryClient } from "@/lib/query/query-client";

type DetailState = {
  data?: Post;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: ReturnType<typeof vi.fn>;
};

type RepliesState = {
  data?: {
    pages: PaginatedPosts[];
  };
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: ReturnType<typeof vi.fn>;
  fetchNextPage: ReturnType<typeof vi.fn>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

const detailMocks = vi.hoisted(() => ({
  post: {
    current: undefined as DetailState | undefined,
  },
  replies: {
    current: undefined as RepliesState | undefined,
  },
  back: vi.fn(),
  deletePost: { mutate: vi.fn(), isPending: false },
  hidePost: { mutate: vi.fn(), isPending: false },
  likePost: { mutate: vi.fn(), isPending: false },
  reportPost: { mutateAsync: vi.fn(), reset: vi.fn(), isPending: false, error: null as Error | null },
  repostPost: { mutate: vi.fn(), isPending: false },
  savePost: { mutate: vi.fn(), isPending: false },
  muteUser: { mutate: vi.fn(), isPending: false },
  blockUser: { mutate: vi.fn(), isPending: false },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: detailMocks.back,
  }),
}));

vi.mock("@/features/posts/hooks/use-post-detail-query", () => ({
  usePostDetailQuery: () => detailMocks.post.current,
  usePostRepliesQuery: () => detailMocks.replies.current,
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => ({ data: undefined }),
}));

vi.mock("@/features/posts/hooks/use-post-mutations", () => ({
  useDeletePostMutation: () => detailMocks.deletePost,
}));

vi.mock("@/features/social/hooks/use-post-interactions", () => ({
  useHidePostMutation: () => detailMocks.hidePost,
  useLikePostMutation: () => detailMocks.likePost,
  useReportPostMutation: () => detailMocks.reportPost,
  useRepostPostMutation: () => detailMocks.repostPost,
  useSavePostMutation: () => detailMocks.savePost,
}));

vi.mock("@/features/social/hooks/use-follow-interactions", () => ({
  useBlockUserMutation: () => detailMocks.blockUser,
  useMuteUserMutation: () => detailMocks.muteUser,
}));

function createPost(): Post {
  return {
    id: "post-1",
    author: {
      id: "user-1",
      name: "Le Tien Dat",
      username: "letiendat",
      isVerified: false,
    },
    content: "Detail content",
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
  };
}

function setDetailState(overrides: Partial<DetailState>) {
  detailMocks.post.current = {
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  };
}

function setRepliesState(overrides: Partial<RepliesState>) {
  detailMocks.replies.current = {
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    ...overrides,
  };
}

describe("PostDetailView", () => {
  it("renders post detail and empty replies", () => {
    const queryClient = createQueryClient();
    setDetailState({ data: createPost() });
    setRepliesState({
      data: {
        pages: [
          {
            posts: [],
            pageInfo: {
              currentPage: 1,
              perPage: 20,
              hasNextPage: false,
            },
          },
        ],
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <PostDetailView postId="post-1" />
      </QueryClientProvider>,
    );

    expect(screen.getByRole("heading", { name: "Post" })).toBeInTheDocument();
    expect(screen.getByText("Detail content")).toBeInTheDocument();
    expect(screen.getByText("No replies yet")).toBeInTheDocument();
  });

  it("renders not found state", () => {
    const queryClient = createQueryClient();
    setDetailState({
      isError: true,
      error: new AppError({
        code: "NOT_FOUND",
        message: "Post not found.",
        status: 404,
      }),
    });
    setRepliesState({});

    render(
      <QueryClientProvider client={queryClient}>
        <PostDetailView postId="missing-post" />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Post not found")).toBeInTheDocument();
  });
});
