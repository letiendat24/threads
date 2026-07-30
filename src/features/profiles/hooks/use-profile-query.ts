"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AuthUser, UpdateProfileRequest } from "@/features/auth/types/auth-types";
import { queryKeys } from "@/lib/query/query-keys";
import { ProfileService } from "@/services/ProfileService";

export function useProfileConnectionsQuery(userId: string, type: "followers" | "following") {
  return useQuery({
    queryKey:
      type === "followers"
        ? queryKeys.profiles.followers(userId)
        : queryKeys.profiles.following(userId),
    queryFn: ({ signal }) =>
      type === "followers"
        ? ProfileService.getFollowers(userId, { signal })
        : ProfileService.getFollowing(userId, { signal }),
    enabled: userId.length > 0,
  });
}

export function useUserRepostsQuery(userId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.profiles.reposts(userId, { perPage: 20 }),
    queryFn: ({ pageParam, signal }) =>
      ProfileService.getUserReposts({
        userId,
        page: pageParam,
        perPage: 20,
        signal,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
    enabled: userId.length > 0,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => ProfileService.updateProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData<AuthUser | undefined>(queryKeys.auth.currentUser(), (currentUser) => {
        const nextUser = {
          ...currentUser,
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email ?? currentUser?.email,
          avatar: profile.avatarUrl ?? currentUser?.avatar,
          bio: profile.bio ?? "",
          is_private: profile.isPrivate,
        };

        return nextUser;
      });
      toast.success("Profile updated.");
    },
  });
}
