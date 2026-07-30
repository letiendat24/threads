import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeedTabs } from "@/features/feed/components/feed-tabs";

describe("FeedTabs", () => {
  it("marks the active feed tab", () => {
    render(<FeedTabs activeType="following" />);

    expect(screen.getByRole("tab", { name: "Dành cho bạn" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Đang theo dõi" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Bài viết tự hủy" })).toHaveAttribute("aria-disabled", "true");
  });
});
