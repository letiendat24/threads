import { describe, expect, it } from "vitest";

import { queryKeys } from "@/lib/query/query-keys";

describe("queryKeys", () => {
  it("creates stable post detail keys", () => {
    expect(queryKeys.posts.detail("post-1")).toEqual(["posts", "detail", "post-1"]);
  });

  it("keeps pagination in feed keys", () => {
    expect(queryKeys.feed.home({ page: 2, perPage: 20 })).toEqual([
      "feed",
      "home",
      { page: 2, perPage: 20 },
    ]);
  });

  it("creates profile repost keys", () => {
    expect(queryKeys.profiles.reposts("user-1", { perPage: 20 })).toEqual([
      "profiles",
      "detail",
      "user-1",
      "reposts",
      { perPage: 20 },
    ]);
  });

  it("keeps search pagination and per-section page sizes", () => {
    expect(queryKeys.search.results({ q: "dat", page: 1, perPageTopics: 5, perPageUsers: 6 })).toEqual([
      "search",
      "results",
      { q: "dat", page: 1, perPageTopics: 5, perPageUsers: 6 },
    ]);
  });
});
