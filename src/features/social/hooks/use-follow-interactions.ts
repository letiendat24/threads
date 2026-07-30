"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

import { SocialService } from "@/services/SocialService";

type UserRecord = Record<string, unknown>;

interface FollowVariables {
  userId: string;
  following: boolean;
}

interface FollowSnapshot {
  queries: Array<[QueryKey, unknown]>;
}

function isRecord(value: unknown): value is UserRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTargetUser(value: unknown, userId: string) {
  return isRecord(value) && String(value.id ?? value.user_id ?? "") === userId;
}

function updateFollowFields(user: UserRecord, following: boolean): UserRecord {
  const followerCount = typeof user.followers_count === "number" ? user.followers_count : undefined;
  const nextFollowerCount =
    followerCount === undefined ? undefined : Math.max(0, followerCount + (following ? 1 : -1));

  return {
    ...user,
    is_following: following,
    is_followed_by_auth: following,
    following,
    ...(nextFollowerCount === undefined ? {} : { followers_count: nextFollowerCount }),
  };
}

function updateUserInUnknownData(data: unknown, userId: string, following: boolean): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => updateUserInUnknownData(item, userId, following));
  }

  if (!isRecord(data)) {
    return data;
  }

  if (isTargetUser(data, userId)) {
    return updateFollowFields(data, following);
  }

  let changed = false;
  const nextData: UserRecord = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) || isRecord(value)) {
      const nextValue = updateUserInUnknownData(value, userId, following);
      if (nextValue !== value) {
        nextData[key] = nextValue;
        changed = true;
      }
    }
  }

  return changed ? nextData : data;
}

export function useFollowUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FollowVariables, FollowSnapshot>({
    mutationFn: ({ userId, following }) =>
      following ? SocialService.unfollowUser(userId) : SocialService.followUser(userId),
    onMutate: async ({ userId, following }) => {
      await queryClient.cancelQueries({ queryKey: ["profiles"] });
      await queryClient.cancelQueries({ queryKey: ["search"] });

      const queries = queryClient
        .getQueriesData({ predicate: ({ queryKey }) => Array.isArray(queryKey) && ["profiles", "search"].includes(String(queryKey[0])) })
        .map(([queryKey, data]) => [queryKey, data] as [QueryKey, unknown]);

      for (const [queryKey] of queries) {
        queryClient.setQueryData(queryKey, (data: unknown) => updateUserInUnknownData(data, userId, !following));
      }

      return { queries };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        for (const [queryKey, data] of context.queries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      toast.error("Follow action failed.");
    },
  });
}

export function useMuteUserMutation() {
  return useMutation({
    mutationFn: (userId: string) => SocialService.muteUser(userId),
    onSuccess: () => toast.success("User muted."),
    onError: () => toast.error("Could not mute user."),
  });
}

export function useBlockUserMutation() {
  return useMutation({
    mutationFn: (userId: string) => SocialService.blockUser(userId),
    onSuccess: () => toast.success("User blocked."),
    onError: () => toast.error("Could not block user."),
  });
}
