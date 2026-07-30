import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PostHeader } from "@/features/posts/components/post-header";
import type { Post } from "@/features/posts/types/post-types";

const headerMocks = vi.hoisted(() => ({
  currentUserId: "user-1",
  copyTextToClipboard: vi.fn(),
  deletePost: { mutate: vi.fn(), isPending: false },
  hidePost: { mutate: vi.fn(), isPending: false },
  reportPost: { mutate: vi.fn(), mutateAsync: vi.fn(), reset: vi.fn(), isPending: false, error: null as Error | null },
  muteUser: { mutate: vi.fn(), isPending: false },
  blockUser: { mutate: vi.fn(), isPending: false },
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => ({
    data: {
      id: headerMocks.currentUserId,
    },
  }),
}));

vi.mock("@/features/posts/hooks/use-post-mutations", () => ({
  useDeletePostMutation: () => headerMocks.deletePost,
}));

vi.mock("@/features/social/hooks/use-post-interactions", () => ({
  useHidePostMutation: () => headerMocks.hidePost,
  useReportPostMutation: () => headerMocks.reportPost,
}));

vi.mock("@/features/social/hooks/use-follow-interactions", () => ({
  useMuteUserMutation: () => headerMocks.muteUser,
  useBlockUserMutation: () => headerMocks.blockUser,
}));

vi.mock("@/features/social/utils/share-post", () => ({
  copyTextToClipboard: headerMocks.copyTextToClipboard,
}));

function createPost(authorId = "user-1"): Post {
  return {
    id: "post-1",
    author: {
      id: authorId,
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
  };
}

describe("PostHeader", () => {
  beforeEach(() => {
    headerMocks.currentUserId = "user-1";
    headerMocks.copyTextToClipboard.mockReset();
    headerMocks.copyTextToClipboard.mockResolvedValue(undefined);
    headerMocks.reportPost.mutate.mockReset();
    headerMocks.reportPost.mutateAsync.mockReset();
    headerMocks.reportPost.reset.mockReset();
    headerMocks.reportPost.isPending = false;
    headerMocks.reportPost.error = null;
  });

  it("shows owner menu actions only for the owner", async () => {
    const user = userEvent.setup();
    render(<PostHeader post={createPost("user-1")} />);

    await user.click(screen.getByRole("button", { name: "More post options" }));

    expect(await screen.findByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("hides owner menu actions for other users", async () => {
    const user = userEvent.setup();
    render(<PostHeader post={createPost("other-user")} />);

    await user.click(screen.getByRole("button", { name: "More post options" }));

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(await screen.findByText("Mute @letiendat")).toBeInTheDocument();
  });

  it("copies the post link", async () => {
    const user = userEvent.setup();
    render(<PostHeader post={createPost("other-user")} />);

    await user.click(screen.getByRole("button", { name: "More post options" }));
    await user.click(await screen.findByText("Copy link"));

    await waitFor(() => {
      expect(headerMocks.copyTextToClipboard).toHaveBeenCalledWith("http://localhost:3000/post/post-1");
    });
  });
});
