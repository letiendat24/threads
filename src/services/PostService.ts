import { mapPaginatedPosts, mapPost } from "@/features/posts/api/post-mappers";
import type { PaginatedPosts, Post } from "@/features/posts/types/post-types";
import { axiosClient } from "@/lib/api/axios-client";

export interface PageRequest {
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
}

export interface ComposePostRequest {
  content: string;
  media?: File[];
  replyPermission?: string;
  topicName?: string;
}

function createPostFormData(request: ComposePostRequest) {
  const formData = new FormData();
  formData.set("content", request.content);

  if (request.replyPermission) {
    formData.set("reply_permission", request.replyPermission);
  }

  if (request.topicName) {
    formData.set("topic_name", request.topicName);
  }

  for (const file of request.media ?? []) {
    formData.append("media[]", file);
  }

  return formData;
}

export class PostService {
  static async getPost(postId: string, signal?: AbortSignal): Promise<Post> {
    const response = await axiosClient.get<unknown>(`/api/posts/${postId}`, { signal });

    return mapPost(response.data);
  }

  static async getPostReplies(postId: string, request: PageRequest = {}): Promise<PaginatedPosts> {
    const page = request.page ?? 1;
    const perPage = request.perPage ?? 20;

    const response = await axiosClient.get<unknown>(`/api/posts/${postId}/replies`, {
      params: {
        page,
        per_page: perPage,
      },
      signal: request.signal,
    });

    return mapPaginatedPosts(response.data, page, perPage);
  }

  static async createPost(request: ComposePostRequest): Promise<Post> {
    const response = await axiosClient.post<unknown>("/api/posts", createPostFormData(request));

    return mapPost(response.data);
  }

  static async createReply(postId: string, request: ComposePostRequest): Promise<Post> {
    const response = await axiosClient.post<unknown>(`/api/posts/${postId}/reply`, createPostFormData(request));

    return mapPost(response.data);
  }

  static async quotePost(postId: string, request: ComposePostRequest): Promise<Post> {
    const response = await axiosClient.post<unknown>(`/api/posts/${postId}/quote`, createPostFormData(request));

    return mapPost(response.data);
  }

  static async updatePost(postId: string, request: ComposePostRequest): Promise<Post> {
    const formData = createPostFormData(request);
    formData.set("_method", "PUT");

    const response = await axiosClient.post<unknown>(`/api/posts/${postId}`, formData);

    return mapPost(response.data);
  }

  static async deletePost(postId: string): Promise<void> {
    await axiosClient.post(`/api/posts/${postId}`, {
      _method: "DELETE",
    });
  }
}
