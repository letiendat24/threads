import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { PostCard } from "@/features/posts/components/post-card";
import type { Post } from "@/features/posts/types/post-types";
import { createQueryClient } from "@/lib/query/query-client";

const postCardMocks = vi.hoisted(() => ({
  deletePost: { mutate: vi.fn(), isPending: false },
  hidePost: { mutate: vi.fn(), isPending: false },
  likePost: { mutate: vi.fn(), isPending: false },
  reportPost: { mutateAsync: vi.fn(), reset: vi.fn(), isPending: false, error: null as Error | null },
  repostPost: { mutate: vi.fn(), isPending: false },
  savePost: { mutate: vi.fn(), isPending: false },
  muteUser: { mutate: vi.fn(), isPending: false },
  blockUser: { mutate: vi.fn(), isPending: false },
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => ({ data: undefined }),
}));

vi.mock("@/features/posts/hooks/use-post-mutations", () => ({
  useDeletePostMutation: () => postCardMocks.deletePost,
}));

vi.mock("@/features/social/hooks/use-post-interactions", () => ({
  useHidePostMutation: () => postCardMocks.hidePost,
  useLikePostMutation: () => postCardMocks.likePost,
  useReportPostMutation: () => postCardMocks.reportPost,
  useRepostPostMutation: () => postCardMocks.repostPost,
  useSavePostMutation: () => postCardMocks.savePost,
}));

vi.mock("@/features/social/hooks/use-follow-interactions", () => ({
  useBlockUserMutation: () => postCardMocks.blockUser,
  useMuteUserMutation: () => postCardMocks.muteUser,
}));

const post: Post = {
  id: "post-1",
  author: {
    id: "user-1",
    name: "Le Tien Dat",
    username: "letiendat",
    isVerified: true,
  },
  content: "A polished Threads-like post card.",
  createdAt: "2026-07-29T08:00:00.000Z",
  media: [],
  counts: {
    replies: 4,
    reposts: 2,
    likes: 12,
  },
  isLiked: true,
  isReposted: false,
  isSaved: false,
  isHidden: false,
  isDeleted: false,
  isUnavailable: false,
};

describe("PostCard", () => {
  it("renders author, content, metadata and actions", () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <PostCard post={post} />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Le Tien Dat")).toBeInTheDocument();
    expect(screen.getByText("@letiendat")).toBeInTheDocument();
    expect(screen.getByText("A polished Threads-like post card.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "A polished Threads-like post card." })).toHaveAttribute(
      "href",
      "/post/post-1",
    );
    expect(screen.getByRole("button", { name: "Reply" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Liked" })).toBeInTheDocument();
  });
});
