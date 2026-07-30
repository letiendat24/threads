import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ComposerDialog } from "@/features/posts/components/composer-dialog";
import { COMPOSER_CHARACTER_LIMIT } from "@/features/posts/schemas/composer-schema";
import type { Post } from "@/features/posts/types/post-types";
import { AppError } from "@/lib/api/api-error";
import { useUiStore } from "@/stores/ui-store";

const composerMocks = vi.hoisted(() => ({
  create: {
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
  reply: {
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
  quote: {
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
  update: {
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
  deletePost: {
    mutate: vi.fn(),
    isPending: false,
  },
  hidePost: {
    mutate: vi.fn(),
    isPending: false,
  },
  reportPost: {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
  muteUser: {
    mutate: vi.fn(),
    isPending: false,
  },
  blockUser: {
    mutate: vi.fn(),
    isPending: false,
  },
  contextPost: undefined as Post | undefined,
}));

vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => true,
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => ({
    data: {
      id: "user-1",
      name: "Le Tien Dat",
      username: "letiendat",
    },
  }),
}));

vi.mock("@/features/posts/hooks/use-post-detail-query", () => ({
  usePostDetailQuery: () => ({
    data: composerMocks.contextPost,
    isPending: false,
    isError: false,
  }),
}));

vi.mock("@/features/posts/hooks/use-post-mutations", () => ({
  useCreatePostMutation: () => composerMocks.create,
  useCreateReplyMutation: () => composerMocks.reply,
  useQuotePostMutation: () => composerMocks.quote,
  useUpdatePostMutation: () => composerMocks.update,
  useDeletePostMutation: () => composerMocks.deletePost,
}));

vi.mock("@/features/social/hooks/use-post-interactions", () => ({
  useHidePostMutation: () => composerMocks.hidePost,
  useReportPostMutation: () => composerMocks.reportPost,
}));

vi.mock("@/features/social/hooks/use-follow-interactions", () => ({
  useMuteUserMutation: () => composerMocks.muteUser,
  useBlockUserMutation: () => composerMocks.blockUser,
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
    content: "Parent post",
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

function resetMocks() {
  for (const mutation of [composerMocks.create, composerMocks.reply, composerMocks.quote, composerMocks.update]) {
    mutation.mutateAsync.mockReset();
    mutation.mutateAsync.mockResolvedValue(createPost());
    mutation.reset.mockReset();
    mutation.isPending = false;
    mutation.error = null;
  }

  composerMocks.deletePost.mutate.mockReset();
  composerMocks.deletePost.isPending = false;
  composerMocks.hidePost.mutate.mockReset();
  composerMocks.hidePost.isPending = false;
  composerMocks.reportPost.mutate.mockReset();
  composerMocks.reportPost.mutateAsync.mockReset();
  composerMocks.reportPost.reset.mockReset();
  composerMocks.reportPost.isPending = false;
  composerMocks.reportPost.error = null;
  composerMocks.muteUser.mutate.mockReset();
  composerMocks.muteUser.isPending = false;
  composerMocks.blockUser.mutate.mockReset();
  composerMocks.blockUser.isPending = false;
  composerMocks.contextPost = undefined;
  useUiStore.getState().resetUiState();
}

describe("ComposerDialog", () => {
  beforeEach(() => {
    resetMocks();
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:preview"),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn(() => "media-id"),
    });
  });

  it("validates empty posts", async () => {
    const user = userEvent.setup();
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);

    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(await screen.findByText("Write something or attach media before posting.")).toBeInTheDocument();
    expect(composerMocks.create.mutateAsync).not.toHaveBeenCalled();
  });

  it("validates the character limit", async () => {
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);

    fireEvent.change(screen.getByLabelText("Post content"), {
      target: { value: "a".repeat(COMPOSER_CHARACTER_LIMIT + 1) },
    });

    expect(await screen.findByText(`Posts can be up to ${COMPOSER_CHARACTER_LIMIT} characters.`)).toBeInTheDocument();
  });

  it("creates a post successfully", async () => {
    const user = userEvent.setup();
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);

    await user.type(screen.getByLabelText("Post content"), "A new thread");
    await user.click(screen.getByRole("button", { name: "Post" }));

    await waitFor(() => {
      expect(composerMocks.create.mutateAsync).toHaveBeenCalledWith({
        content: "A new thread",
        media: [],
      });
    });
    expect(useUiStore.getState().isComposerOpen).toBe(false);
  });

  it("keeps the composer open when create post fails", async () => {
    const user = userEvent.setup();
    const error = new AppError({ code: "SERVER_ERROR", message: "Could not post.", status: 500 });
    composerMocks.create.error = error;
    composerMocks.create.mutateAsync.mockRejectedValueOnce(error);
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);

    await user.type(screen.getByLabelText("Post content"), "A new thread");
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(await screen.findByText("Could not post.")).toBeInTheDocument();
    expect(useUiStore.getState().isComposerOpen).toBe(true);
  });

  it("prevents duplicate submits", async () => {
    const user = userEvent.setup();
    let resolveMutation: (post: Post) => void = () => undefined;
    composerMocks.create.mutateAsync.mockReturnValue(
      new Promise<Post>((resolve) => {
        resolveMutation = resolve;
      }),
    );
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);

    await user.type(screen.getByLabelText("Post content"), "A new thread");
    const submitButton = screen.getByRole("button", { name: "Post" });
    await user.click(submitButton);
    await user.click(submitButton);

    expect(composerMocks.create.mutateAsync).toHaveBeenCalledTimes(1);

    resolveMutation(createPost());
    await waitFor(() => {
      expect(useUiStore.getState().isComposerOpen).toBe(false);
    });
  });

  it("submits a reply with parent context", async () => {
    const user = userEvent.setup();
    composerMocks.contextPost = createPost();
    useUiStore.getState().openComposer("reply", { postId: "post-1" });
    render(<ComposerDialog />);

    expect(screen.getByText("Parent post")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Post content"), "A reply");
    await user.click(screen.getByRole("button", { name: "Reply" }));

    await waitFor(() => {
      expect(composerMocks.reply.mutateAsync).toHaveBeenCalledWith({
        content: "A reply",
        media: [],
      });
    });
  });

  it("validates selected media", async () => {
    const user = userEvent.setup({ applyAccept: false });
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, new File(["plain text"], "notes.txt", { type: "text/plain" }));

    expect(await screen.findByText("notes.txt is not a supported media type.")).toBeInTheDocument();
  });

  it("confirms discard for dirty drafts", async () => {
    const user = userEvent.setup();
    useUiStore.getState().openComposer("post");
    render(<ComposerDialog />);

    await user.type(screen.getByLabelText("Post content"), "Draft text");
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(await screen.findByText("Discard draft?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Discard" }));

    expect(useUiStore.getState().isComposerOpen).toBe(false);
  });
});
