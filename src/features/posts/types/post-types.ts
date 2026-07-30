export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export type PostMediaType = "image" | "video" | "unknown";

export interface PostMedia {
  id: string;
  url: string;
  type: PostMediaType;
  alt: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

export interface PostCounts {
  replies: number;
  reposts: number;
  likes: number;
}

export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  createdAt?: string;
  media: PostMedia[];
  counts: PostCounts;
  isLiked: boolean;
  isReposted: boolean;
  isSaved: boolean;
  isHidden: boolean;
  isDeleted: boolean;
  isUnavailable: boolean;
  replyPermission?: string;
  topicName?: string;
}

export interface PageInfo {
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  nextPage?: number;
}

export interface PaginatedPosts {
  posts: Post[];
  pageInfo: PageInfo;
}
