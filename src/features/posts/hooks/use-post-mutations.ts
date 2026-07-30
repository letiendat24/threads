"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  insertPostIntoFeedCaches,
  insertReplyIntoCaches,
  removePostAcrossCaches,
  replacePostAcrossCaches,
} from "@/features/posts/utils/post-cache";
import { PostService, type ComposePostRequest } from "@/services/PostService";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ComposePostRequest) => PostService.createPost(request),
    onSuccess: (post) => {
      insertPostIntoFeedCaches(queryClient, post);
      toast.success("Posted.");
    },
  });
}

export function useCreateReplyMutation(parentPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ComposePostRequest) => PostService.createReply(parentPostId, request),
    onSuccess: (reply) => {
      insertReplyIntoCaches(queryClient, parentPostId, reply);
      toast.success("Reply posted.");
    },
  });
}

export function useQuotePostMutation(parentPostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ComposePostRequest) => PostService.quotePost(parentPostId, request),
    onSuccess: (post) => {
      insertPostIntoFeedCaches(queryClient, post);
      toast.success("Quote posted.");
    },
  });
}

export function useUpdatePostMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ComposePostRequest) => PostService.updatePost(postId, request),
    onSuccess: (post) => {
      replacePostAcrossCaches(queryClient, post);
      toast.success("Post updated.");
    },
  });
}

export function useDeletePostMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PostService.deletePost(postId),
    onSuccess: () => {
      removePostAcrossCaches(queryClient, postId);
      toast.success("Post deleted.");
    },
  });
}
