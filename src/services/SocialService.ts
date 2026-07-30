import { axiosClient } from "@/lib/api/axios-client";

export interface ReportPostRequest {
  postId: string;
  reason: string;
  description?: string;
}

export class SocialService {
  static likePost(postId: string) {
    return axiosClient.post(`/api/posts/${postId}/like`);
  }

  static repostPost(postId: string) {
    return axiosClient.post(`/api/posts/${postId}/repost`);
  }

  static savePost(postId: string) {
    return axiosClient.post(`/api/posts/${postId}/save`);
  }

  static hidePost(postId: string) {
    return axiosClient.post(`/api/posts/${postId}/hide`);
  }

  static reportPost({ postId, reason, description = "" }: ReportPostRequest) {
    return axiosClient.post(`/api/posts/${postId}/report`, {
      reason,
      description,
    });
  }

  static followUser(userId: string) {
    return axiosClient.post(`/api/users/${userId}/follow`);
  }

  static unfollowUser(userId: string) {
    return axiosClient.post(`/api/users/${userId}/follow`, {
      _method: "DELETE",
    });
  }

  static muteUser(userId: string) {
    return axiosClient.post(`/api/users/${userId}/mute`);
  }

  static unmuteUser(userId: string) {
    return axiosClient.post(`/api/users/${userId}/mute`, {
      _method: "DELETE",
    });
  }

  static blockUser(userId: string) {
    return axiosClient.post(`/api/users/${userId}/block`);
  }

  static unblockUser(userId: string) {
    return axiosClient.post(`/api/users/${userId}/block`, {
      _method: "DELETE",
    });
  }
}
