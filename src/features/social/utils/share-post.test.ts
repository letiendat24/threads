import { beforeEach, describe, expect, it, vi } from "vitest";

import { copyTextToClipboard, sharePostLink } from "@/features/social/utils/share-post";

describe("share-post utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("copies text to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    await copyTextToClipboard("https://example.test/post/1");

    expect(writeText).toHaveBeenCalledWith("https://example.test/post/1");
  });

  it("falls back to copying when Web Share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });

    await expect(sharePostLink("https://example.test/post/1")).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("https://example.test/post/1");
  });
});
