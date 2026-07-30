import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchView } from "@/features/search/components/search-view";
import type { SearchResults } from "@/features/search/types/search-types";

const searchMocks = vi.hoisted(() => ({
  replace: vi.fn(),
  query: {
    data: undefined as SearchResults | undefined,
    isPending: false,
    isError: false,
    error: null as Error | null,
    refetch: vi.fn(),
  },
  keywordCalls: [] as string[],
  params: "",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/search",
  useRouter: () => ({
    replace: searchMocks.replace,
  }),
  useSearchParams: () => new URLSearchParams(searchMocks.params),
}));

vi.mock("@/features/search/hooks/use-search-query", () => ({
  useSearchQuery: (keyword: string) => {
    searchMocks.keywordCalls.push(keyword);
    return searchMocks.query;
  },
}));

vi.mock("@/features/social/hooks/use-follow-interactions", () => ({
  useFollowUserMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

function resetMocks() {
  searchMocks.replace.mockReset();
  searchMocks.query.data = undefined;
  searchMocks.query.isPending = false;
  searchMocks.query.isError = false;
  searchMocks.query.error = null;
  searchMocks.query.refetch.mockReset();
  searchMocks.keywordCalls = [];
  searchMocks.params = "";
}

describe("SearchView", () => {
  beforeEach(() => {
    resetMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the empty search state", () => {
    render(<SearchView />);

    expect(screen.getByText("Search Threads")).toBeInTheDocument();
  });

  it("debounces keyword into the URL", () => {
    vi.useFakeTimers();
    render(<SearchView />);

    fireEvent.change(screen.getByLabelText("Search keyword"), {
      target: { value: "dat" },
    });
    act(() => {
      vi.advanceTimersByTime(349);
    });

    expect(searchMocks.replace).not.toHaveBeenCalledWith("/search?q=dat", expect.anything());

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(searchMocks.replace).toHaveBeenLastCalledWith("/search?q=dat", { scroll: false });
  });

  it("renders users and topics from search results", () => {
    searchMocks.params = "q=da";
    searchMocks.query.data = {
      users: [
        {
          id: "user-1",
          name: "Le Tien Dat",
          username: "letiendat",
          bio: "Frontend engineer",
          isPrivate: false,
          isVerified: false,
          isFollowing: false,
        },
      ],
      topics: [{ id: "topic-1", name: "nextjs", postsCount: 4 }],
    };

    render(<SearchView />);

    expect(screen.getByText("Le Tien Dat")).toBeInTheDocument();
    expect(screen.getByText("#nextjs")).toBeInTheDocument();
    expect(screen.getByText("4 posts")).toBeInTheDocument();
  });
});
