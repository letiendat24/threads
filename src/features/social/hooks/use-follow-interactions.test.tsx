import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFollowUserMutation } from "@/features/social/hooks/use-follow-interactions";
import { createQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";

const socialServiceMocks = vi.hoisted(() => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}));

vi.mock("@/services/SocialService", () => ({
  SocialService: {
    followUser: socialServiceMocks.followUser,
    unfollowUser: socialServiceMocks.unfollowUser,
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

function createWrapper(queryClient: ReturnType<typeof createQueryClient>) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return Wrapper;
}

describe("useFollowUserMutation", () => {
  beforeEach(() => {
    socialServiceMocks.followUser.mockReset();
    socialServiceMocks.unfollowUser.mockReset();
  });

  it("optimistically follows a user", async () => {
    socialServiceMocks.followUser.mockResolvedValueOnce({});
    const queryClient = createQueryClient();
    queryClient.setQueryData(queryKeys.search.results({ q: "dat" }), {
      users: [{ id: "user-1", username: "dat", is_following: false, followers_count: 2 }],
    });
    const { result } = renderHook(() => useFollowUserMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ userId: "user-1", following: false });

    await waitFor(() => {
      expect(queryClient.getQueryData<{ users: Array<Record<string, unknown>> }>(queryKeys.search.results({ q: "dat" }))?.users[0]).toMatchObject({
        is_following: true,
        followers_count: 3,
      });
    });
  });

  it("rolls back follow state on failure", async () => {
    socialServiceMocks.followUser.mockRejectedValueOnce(new Error("Nope"));
    const queryClient = createQueryClient();
    queryClient.setQueryData(queryKeys.profiles.detail("dat"), {
      id: "user-1",
      username: "dat",
      is_following: false,
      followers_count: 2,
    });
    const { result } = renderHook(() => useFollowUserMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ userId: "user-1", following: false });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(queryClient.getQueryData(queryKeys.profiles.detail("dat"))).toMatchObject({
      is_following: false,
      followers_count: 2,
    });
  });
});
