import type { AuthUser } from "@/features/auth/types/auth-types";
import type { UserProfile } from "@/features/profiles/types/profile-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["1", "true", "yes"].includes(value.toLowerCase());
  }

  return false;
}

function firstString(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = stringValue(record[key]);
    if (value) {
      return value;
    }
  }

  return undefined;
}

function firstNumber(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = numberValue(record[key]);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function unwrapData(response: unknown): unknown {
  if (!isRecord(response)) {
    return response;
  }

  const data = response.data;

  if (isRecord(data) && !Array.isArray(data.data)) {
    return data;
  }

  return response;
}

function extractCollection(response: unknown) {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }

  if (isRecord(data)) {
    if (Array.isArray(data.data)) {
      return data.data;
    }

    for (const key of ["users", "items", "results", "followers", "following", "followings"]) {
      const value = data[key];
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  for (const key of ["users", "items", "results", "followers", "following", "followings"]) {
    const value = response[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

export function mapUserProfile(response: unknown): UserProfile {
  const rawUser = unwrapData(response);
  const user = isRecord(rawUser) ? rawUser : {};
  const id = String(firstNumber(user, ["id", "user_id"]) ?? firstString(user, ["id", "uuid", "user_id"]) ?? "unknown");
  const username = (firstString(user, ["username", "handle", "slug"]) ?? `user-${id}`).replace(/^@/, "");
  const name = firstString(user, ["name", "display_name", "full_name"]) ?? username;

  return {
    id,
    name,
    username,
    email: firstString(user, ["email"]),
    avatarUrl: firstString(user, ["avatar_url", "avatar", "profile_photo_url", "photo_url", "image"]),
    bio: firstString(user, ["bio", "description", "about"]),
    link: firstString(user, ["link", "website", "url"]),
    isPrivate: booleanValue(user.is_private ?? user.private),
    isVerified: booleanValue(user.is_verified ?? user.verified),
    isFollowing: booleanValue(user.is_following ?? user.is_followed_by_auth ?? user.following),
    followersCount: firstNumber(user, ["followers_count", "follower_count"]),
    followingCount: firstNumber(user, ["following_count", "followings_count"]),
    postsCount: firstNumber(user, ["posts_count", "threads_count"]),
    createdAt: firstString(user, ["created_at", "createdAt"]),
  };
}

export function mapAuthUserToProfile(user: AuthUser): UserProfile {
  return mapUserProfile(user);
}

export function mapUserProfiles(response: unknown) {
  return extractCollection(response).map(mapUserProfile);
}
