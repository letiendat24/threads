import { describe, expect, it } from "vitest";

import { useUiStore } from "@/stores/ui-store";

describe("useUiStore", () => {
  it("stores only global UI state for the composer", () => {
    useUiStore.getState().resetUiState();
    useUiStore.getState().openComposer("reply", { postId: "post-1" });

    expect(useUiStore.getState()).toMatchObject({
      activeModal: "composer",
      composerPostId: "post-1",
      composerType: "reply",
      isComposerOpen: true,
    });

    useUiStore.getState().closeComposer();

    expect(useUiStore.getState().isComposerOpen).toBe(false);
    expect(useUiStore.getState().composerPostId).toBeUndefined();
  });
});
