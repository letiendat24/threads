import type { AuthUser, UpdateProfileRequest } from "@/features/auth/types/auth-types";
import { mapPaginatedPosts } from "@/features/posts/api/post-mappers";
import type { PaginatedPosts } from "@/features/posts/types/post-types";
import { mapUserProfile, mapUserProfiles } from "@/features/profiles/utils/profile-mappers";
import { axiosClient } from "@/lib/api/axios-client";
import { AuthService } from "@/services/AuthService";

import type { UserProfile } from "@/features/profiles/types/profile-types";

type ApiEnvelope<T> = T | { data: T; message?: string; status?: string };

export interface UserRepostsRequest {
  userId: string;
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
}

export class ProfileService {
  static async updateProfile(payload: UpdateProfileRequest) {
    const user = await AuthService.updateProfile(payload);

    return mapUserProfile(user);
  }

  static async getFollowers(userId: string, { signal }: { signal?: AbortSignal } = {}) {
    const response = await axiosClient.get<ApiEnvelope<unknown>>(`/api/users/${userId}/followers`, { signal });

    return mapUserProfiles(response.data);
  }

  static async getFollowing(userId: string, { signal }: { signal?: AbortSignal } = {}) {
    const response = await axiosClient.get<ApiEnvelope<unknown>>(`/api/users/${userId}/followings`, { signal });

    return mapUserProfiles(response.data);
  }

  static async getUserReposts({ userId, page = 1, perPage = 20, signal }: UserRepostsRequest): Promise<PaginatedPosts> {
    const response = await axiosClient.get<ApiEnvelope<unknown>>(`/api/users/${userId}/reposts`, {
      params: {
        page,
        per_page: perPage,
      },
      signal,
    });

    return mapPaginatedPosts(response.data, page, perPage);
  }

  static mapAuthUser(user: AuthUser): UserProfile {
    return mapUserProfile(user);
  }
}
