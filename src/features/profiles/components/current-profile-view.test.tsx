import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EditProfileDialog } from "@/features/profiles/components/edit-profile-dialog";
import { CurrentProfileView } from "@/features/profiles/components/current-profile-view";
import type { UserProfile } from "@/features/profiles/types/profile-types";
import { AppError } from "@/lib/api/api-error";

const profileMocks = vi.hoisted(() => ({
  currentUser: {
    data: undefined as Record<string, unknown> | undefined,
    isPending: false,
    isError: false,
    error: null as Error | null,
    refetch: vi.fn(),
  },
  connections: {
    data: [] as UserProfile[],
    isPending: false,
    isError: false,
    error: null as Error | null,
    refetch: vi.fn(),
  },
  reposts: {
    data: {
      pages: [
        {
          posts: [],
          pageInfo: {
            currentPage: 1,
            perPage: 20,
            hasNextPage: false,
          },
        },
      ],
    },
    isPending: false,
    isError: false,
    error: null as Error | null,
    refetch: vi.fn(),
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  },
  updateProfile: {
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => profileMocks.currentUser,
}));

vi.mock("@/features/profiles/hooks/use-profile-query", () => ({
  useProfileConnectionsQuery: () => profileMocks.connections,
  useUpdateProfileMutation: () => profileMocks.updateProfile,
  useUserRepostsQuery: () => profileMocks.reposts,
}));

vi.mock("@/features/social/utils/share-post", () => ({
  copyTextToClipboard: vi.fn(),
}));

function createProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: "user-1",
    name: "Le Tien Dat",
    username: "letiendat",
    bio: "Frontend engineer",
    isPrivate: false,
    isVerified: false,
    isFollowing: false,
    followersCount: 12,
    followingCount: 8,
    ...overrides,
  };
}

function resetMocks() {
  profileMocks.currentUser.data = {
    id: "user-1",
    name: "Le Tien Dat",
    username: "letiendat",
    bio: "Frontend engineer",
  };
  profileMocks.currentUser.isPending = false;
  profileMocks.currentUser.isError = false;
  profileMocks.currentUser.error = null;
  profileMocks.currentUser.refetch.mockReset();
  profileMocks.updateProfile.mutateAsync.mockReset();
  profileMocks.updateProfile.mutateAsync.mockResolvedValue(createProfile());
  profileMocks.updateProfile.reset.mockReset();
  profileMocks.updateProfile.isPending = false;
  profileMocks.updateProfile.error = null;
}

describe("CurrentProfileView", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("renders profile loading state", () => {
    profileMocks.currentUser.isPending = true;

    render(<CurrentProfileView />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders the current profile", () => {
    render(<CurrentProfileView />);

    expect(screen.getByText("Le Tien Dat")).toBeInTheDocument();
    expect(screen.getByText("@letiendat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit profile" })).toBeInTheDocument();
    expect(screen.getByText("Reposts")).toBeInTheDocument();
  });

  it("renders profile not found", () => {
    profileMocks.currentUser.data = undefined;
    profileMocks.currentUser.isError = true;
    profileMocks.currentUser.error = new AppError({
      code: "NOT_FOUND",
      message: "Missing profile.",
      status: 404,
    });

    render(<CurrentProfileView />);

    expect(screen.getByText("Profile not found")).toBeInTheDocument();
  });
});

describe("EditProfileDialog", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("validates required profile fields", async () => {
    const user = userEvent.setup();
    render(<EditProfileDialog profile={createProfile()} />);

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.clear(screen.getByLabelText("Name"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(profileMocks.updateProfile.mutateAsync).not.toHaveBeenCalled();
  });

  it("submits supported profile fields", async () => {
    const user = userEvent.setup();
    render(<EditProfileDialog profile={createProfile()} />);

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    await user.clear(screen.getByLabelText("Bio"));
    await user.type(screen.getByLabelText("Bio"), "Updated bio");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(profileMocks.updateProfile.mutateAsync).toHaveBeenCalledWith(
      {
        name: "Le Tien Dat",
        username: "letiendat",
        bio: "Updated bio",
        avatar: null,
        is_private: false,
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });
});
