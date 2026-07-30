import type { UserProfile } from "@/features/profiles/types/profile-types";

export interface SearchTopic {
  id: string;
  name: string;
  postsCount?: number;
}

export interface SearchResults {
  users: UserProfile[];
  topics: SearchTopic[];
}

export interface SearchRequest {
  q: string;
  page?: number;
  perPageTopics?: number;
  perPageUsers?: number;
  signal?: AbortSignal;
}
