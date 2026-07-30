"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  removePostAcrossCaches,
  restorePostInteraction,
  snapshotPostInteraction,
  updatePostAcrossCaches,
  type PostInteractionSnapshot,
} from "@/features/posts/utils/post-cache";
import type { Post } from "@/features/posts/types/post-types";
import { SocialService, type ReportPostRequest } from "@/services/SocialService";

function clampCount(value: number) {
  return Math.max(0, value);
}

function toggleLike(post: Post) {
  const nextLiked = !post.isLiked;

  return {
    ...post,
    isLiked: nextLiked,
    counts: {
      ...post.counts,
      likes: clampCount(post.counts.likes + (nextLiked ? 1 : -1)),
    },
  };
}

function toggleRepost(post: Post) {
  const nextReposted = !post.isReposted;

  return {
    ...post,
    isReposted: nextReposted,
    counts: {
      ...post.counts,
      reposts: clampCount(post.counts.reposts + (nextReposted ? 1 : -1)),
    },
  };
}

function toggleSave(post: Post) {
  return {
    ...post,
    isSaved: !post.isSaved,
  };
}

interface PostInteractionVariables {
  postId: string;
}

interface PostInteractionContext {
  snapshot: PostInteractionSnapshot;
}

function useOptimisticPostInteraction(
  mutationFn: (postId: string) => Promise<unknown>,
  updater: (post: Post) => Post,
  successMessage?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PostInteractionVariables, PostInteractionContext>({
    mutationFn: ({ postId }) => mutationFn(postId),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const snapshot = snapshotPostInteraction(queryClient, postId);
      updatePostAcrossCaches(queryClient, postId, updater);

      return { snapshot };
    },
    onError: (_error, { postId }, context) => {
      if (context) {
        restorePostInteraction(queryClient, context.snapshot, postId);
      }
      toast.error("Action failed. Please try again.");
    },
    onSuccess: () => {
      if (successMessage) {
        toast.success(successMessage);
      }
    },
  });
}

export function useLikePostMutation() {
  return useOptimisticPostInteraction((postId) => SocialService.likePost(postId), toggleLike);
}

export function useRepostPostMutation() {
  return useOptimisticPostInteraction((postId) => SocialService.repostPost(postId), toggleRepost);
}

export function useSavePostMutation() {
  return useOptimisticPostInteraction((postId) => SocialService.savePost(postId), toggleSave);
}

export function useHidePostMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, PostInteractionVariables, PostInteractionContext>({
    mutationFn: ({ postId }) => SocialService.hidePost(postId),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const snapshot = snapshotPostInteraction(queryClient, postId);
      removePostAcrossCaches(queryClient, postId);

      return { snapshot };
    },
    onError: (_error, { postId }, context) => {
      if (context) {
        restorePostInteraction(queryClient, context.snapshot, postId);
      }
      toast.error("Could not hide post.");
    },
    onSuccess: () => toast.success("Post hidden."),
  });
}

export function useReportPostMutation() {
  return useMutation({
    mutationFn: (request: ReportPostRequest) => SocialService.reportPost(request),
    onSuccess: () => toast.success("Report sent."),
    onError: () => toast.error("Could not send report."),
  });
}
