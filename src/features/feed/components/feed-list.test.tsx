import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FeedList } from "@/features/feed/components/feed-list";
import type { PaginatedPosts, Post } from "@/features/posts/types/post-types";
import { createQueryClient } from "@/lib/query/query-client";

type FeedListState = {
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

const feedMocks = vi.hoisted(() => ({
  state: {
    current: undefined as FeedListState | undefined,
  },
  deletePost: { mutate: vi.fn(), isPending: false },
  hidePost: { mutate: vi.fn(), isPending: false },
  likePost: { mutate: vi.fn(), isPending: false },
  reportPost: { mutateAsync: vi.fn(), reset: vi.fn(), isPending: false, error: null as Error | null },
  repostPost: { mutate: vi.fn(), isPending: false },
  savePost: { mutate: vi.fn(), isPending: false },
  muteUser: { mutate: vi.fn(), isPending: false },
  blockUser: { mutate: vi.fn(), isPending: false },
}));

vi.mock("@/features/feed/hooks/use-feed-query", () => ({
  useFeedQuery: () => feedMocks.state.current,
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => ({ data: undefined }),
}));

vi.mock("@/features/posts/hooks/use-post-mutations", () => ({
  useDeletePostMutation: () => feedMocks.deletePost,
}));

vi.mock("@/features/social/hooks/use-post-interactions", () => ({
  useHidePostMutation: () => feedMocks.hidePost,
  useLikePostMutation: () => feedMocks.likePost,
  useReportPostMutation: () => feedMocks.reportPost,
  useRepostPostMutation: () => feedMocks.repostPost,
  useSavePostMutation: () => feedMocks.savePost,
}));

vi.mock("@/features/social/hooks/use-follow-interactions", () => ({
  useBlockUserMutation: () => feedMocks.blockUser,
  useMuteUserMutation: () => feedMocks.muteUser,
}));

function createPost(id: string): Post {
  return {
    id,
    author: {
      id: "user-1",
      name: "Le Tien Dat",
      username: "letiendat",
      isVerified: false,
    },
    content: `Post ${id}`,
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

function setFeedState(overrides: Partial<FeedListState>) {
  feedMocks.state.current = {
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

  return feedMocks.state.current;
}

function renderFeedList(type: "for_you" | "following") {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <FeedList type={type} />
    </QueryClientProvider>,
  );
}

describe("FeedList", () => {
  beforeEach(() => {
    setFeedState({});
  });

  it("renders loading skeletons", () => {
    setFeedState({ isPending: true });
    renderFeedList("for_you");

    expect(screen.getByRole("status", { name: "Loading posts" })).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    setFeedState({
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
    renderFeedList("following");

    expect(screen.getByText("No posts from people you follow")).toBeInTheDocument();
  });

  it("renders an error state with retry", async () => {
    const user = userEvent.setup();
    const state = setFeedState({
      isError: true,
      error: new Error("Unable to reach the server."),
    });
    renderFeedList("for_you");

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(screen.getByText("Could not load posts")).toBeInTheDocument();
    expect(state.refetch).toHaveBeenCalledTimes(1);
  });

  it("renders posts and paginates", async () => {
    const user = userEvent.setup();
    const state = setFeedState({
      data: {
        pages: [
          {
            posts: [createPost("post-1")],
            pageInfo: {
              currentPage: 1,
              perPage: 20,
              hasNextPage: true,
              nextPage: 2,
            },
          },
        ],
      },
      hasNextPage: true,
    });
    renderFeedList("for_you");

    expect(screen.getByText("Post post-1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(state.fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
