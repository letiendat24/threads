import { describe, expect, it, vi } from "vitest";

import { axiosClient } from "@/lib/api/axios-client";
import { SearchService } from "@/services/SearchService";

vi.mock("@/lib/api/axios-client", () => ({
  axiosClient: {
    get: vi.fn(),
  },
}));

describe("SearchService", () => {
  it("passes search params and abort signal to the backend", async () => {
    const signal = new AbortController().signal;
    vi.mocked(axiosClient.get).mockResolvedValueOnce({
      data: {
        data: {
          users: [],
          topics: [],
        },
      },
    });

    await SearchService.search({
      q: "dat",
      page: 2,
      perPageTopics: 5,
      perPageUsers: 6,
      signal,
    });

    expect(axiosClient.get).toHaveBeenCalledWith("/api/search", {
      params: {
        q: "dat",
        page: 2,
        per_page_topics: 5,
        per_page_users: 6,
      },
      signal,
    });
  });
});
