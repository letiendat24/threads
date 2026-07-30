export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  link?: string;
  isPrivate: boolean;
  isVerified: boolean;
  isFollowing: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  createdAt?: string;
}

export type ProfileConnectionType = "followers" | "following";
