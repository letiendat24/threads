import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PostActions } from "@/features/posts/components/post-actions";
import type { Post } from "@/features/posts/types/post-types";

const interactionMocks = vi.hoisted(() => ({
  like: { mutate: vi.fn(), isPending: true },
  repost: { mutate: vi.fn(), isPending: false },
  save: { mutate: vi.fn(), isPending: false },
}));

vi.mock("@/features/social/hooks/use-post-interactions", () => ({
  useLikePostMutation: () => interactionMocks.like,
  useRepostPostMutation: () => interactionMocks.repost,
  useSavePostMutation: () => interactionMocks.save,
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
      likes: 1,
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

describe("PostActions", () => {
  beforeEach(() => {
    interactionMocks.like.isPending = false;
    interactionMocks.repost.isPending = false;
    interactionMocks.save.isPending = false;
  });

  it("disables social actions while an interaction is pending", () => {
    interactionMocks.like.isPending = true;

    render(<PostActions post={createPost()} />);

    expect(screen.getByRole("button", { name: "Like" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Repost" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("renders a liked post with a red filled heart", () => {
    render(<PostActions post={createPost({ isLiked: true })} />);

    const likedButton = screen.getByRole("button", { name: "Liked" });
    expect(likedButton).toHaveClass("text-destructive");
    expect(likedButton.querySelector("svg")).toHaveClass("fill-destructive");
  });
});
