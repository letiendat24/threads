type PagePagination = {
  page?: number;
  perPage?: number;
};

type SearchParams = PagePagination & {
  perPageTopics?: number;
  perPageUsers?: number;
  q: string;
};

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "current-user"] as const,
    columns: () => [...queryKeys.auth.all, "columns"] as const,
  },
  feed: {
    all: ["feed"] as const,
    home: (pagination?: PagePagination) => [...queryKeys.feed.all, "home", pagination ?? {}] as const,
    following: (pagination?: PagePagination) =>
      [...queryKeys.feed.all, "following", pagination ?? {}] as const,
    type: (type: "for_you" | "following", pagination?: PagePagination) =>
      [...queryKeys.feed.all, type, pagination ?? {}] as const,
  },
  posts: {
    all: ["posts"] as const,
    detail: (postId: string) => [...queryKeys.posts.all, "detail", postId] as const,
    repliesRoot: (postId: string) => [...queryKeys.posts.detail(postId), "replies"] as const,
    replies: (postId: string, pagination?: PagePagination) =>
      [...queryKeys.posts.repliesRoot(postId), pagination ?? {}] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    detail: (handle: string) => [...queryKeys.profiles.all, "detail", handle] as const,
    followers: (handle: string, pagination?: PagePagination) =>
      [...queryKeys.profiles.detail(handle), "followers", pagination ?? {}] as const,
    following: (handle: string, pagination?: PagePagination) =>
      [...queryKeys.profiles.detail(handle), "following", pagination ?? {}] as const,
    reposts: (handle: string, pagination?: PagePagination) =>
      [...queryKeys.profiles.detail(handle), "reposts", pagination ?? {}] as const,
  },
  search: {
    all: ["search"] as const,
    results: (params: SearchParams) => [...queryKeys.search.all, "results", params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (pagination?: PagePagination) =>
      [...queryKeys.notifications.all, "list", pagination ?? {}] as const,
  },
  settings: {
    all: ["settings"] as const,
    current: () => [...queryKeys.settings.all, "current"] as const,
  },
} as const;
