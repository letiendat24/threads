import type { PageInfo, PaginatedPosts, Post, PostAuthor, PostMedia, PostMediaType } from "@/features/posts/types/post-types";

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
    return ["true", "1", "yes"].includes(value.toLowerCase());
  }

  return false;
}

function nestedRecord(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
}

function nestedArray(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
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

function normalizeUsername(value: string | undefined, fallback: string) {
  return (value ?? fallback).replace(/^@/, "");
}

function mediaTypeFromUrl(url: string): PostMediaType {
  const normalized = url.toLowerCase();

  if (/\.(mp4|mov|webm|m4v)(\?|#|$)/.test(normalized)) {
    return "video";
  }

  if (/\.(avif|gif|jpeg|jpg|png|webp)(\?|#|$)/.test(normalized)) {
    return "image";
  }

  return "unknown";
}

function mapAuthor(post: UnknownRecord, postId: string): PostAuthor {
  const author = nestedRecord(post, ["author", "user", "created_by", "owner"]) ?? post;
  const id = String(firstNumber(author, ["id", "user_id"]) ?? firstString(author, ["id", "uuid", "user_id"]) ?? `author-${postId}`);
  const username = normalizeUsername(firstString(author, ["username", "handle", "slug"]), `user-${id}`);
  const name = firstString(author, ["name", "display_name", "full_name"]) ?? username;

  return {
    id,
    name,
    username,
    avatarUrl: firstString(author, ["avatar_url", "avatar", "profile_photo_url", "photo_url", "image"]),
    isVerified: booleanValue(author.is_verified ?? author.verified),
  };
}

function mapMediaItem(value: unknown, index: number, authorName: string): PostMedia | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return {
      id: `${value}-${index}`,
      url: value,
      type: mediaTypeFromUrl(value),
      alt: `Media from ${authorName}`,
    };
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const url = firstString(value, ["url", "src", "path", "media_url", "original_url"]);
  if (!url) {
    return undefined;
  }

  return {
    id: String(firstNumber(value, ["id"]) ?? firstString(value, ["id", "uuid"]) ?? `${url}-${index}`),
    url,
    type: (firstString(value, ["type", "media_type"]) as PostMediaType | undefined) ?? mediaTypeFromUrl(url),
    alt: firstString(value, ["alt", "alt_text", "caption"]) ?? `Media from ${authorName}`,
    width: firstNumber(value, ["width"]),
    height: firstNumber(value, ["height"]),
    thumbnailUrl: firstString(value, ["thumbnail_url", "preview_url"]),
  };
}

function mapMedia(post: UnknownRecord, authorName: string) {
  return nestedArray(post, ["media", "attachments", "images", "files"])
    .map((item, index) => mapMediaItem(item, index, authorName))
    .filter((item): item is PostMedia => Boolean(item));
}

function unwrapSinglePost(response: unknown): unknown {
  if (!isRecord(response)) {
    return response;
  }

  const data = response.data;
  if (isRecord(data) && !Array.isArray(data.data)) {
    return data;
  }

  return response;
}

export function mapPost(response: unknown): Post {
  const rawPost = unwrapSinglePost(response);

  if (!isRecord(rawPost)) {
    return {
      id: "unavailable",
      author: {
        id: "unknown",
        name: "Unknown user",
        username: "unknown",
        isVerified: false,
      },
      content: "",
      media: [],
      counts: {
        replies: 0,
        reposts: 0,
        likes: 0,
      },
      isLiked: false,
      isReposted: false,
      isSaved: false,
      isHidden: false,
      isDeleted: false,
      isUnavailable: true,
    };
  }

  const id = String(firstNumber(rawPost, ["id"]) ?? firstString(rawPost, ["id", "uuid", "slug"]) ?? "unavailable");
  const author = mapAuthor(rawPost, id);

  return {
    id,
    author,
    content: firstString(rawPost, ["content", "body", "text", "caption"]) ?? "",
    createdAt: firstString(rawPost, ["created_at", "createdAt", "published_at", "updated_at"]),
    media: mapMedia(rawPost, author.name),
    counts: {
      replies: firstNumber(rawPost, ["replies_count", "reply_count", "comments_count"]) ?? 0,
      reposts: firstNumber(rawPost, ["reposts_count", "repost_count", "shares_count"]) ?? 0,
      likes: firstNumber(rawPost, ["likes_count", "like_count"]) ?? 0,
    },
    isLiked: booleanValue(rawPost.is_liked_by_auth ?? rawPost.is_liked ?? rawPost.liked_by_auth),
    isReposted: booleanValue(rawPost.is_reposted_by_auth ?? rawPost.is_reposted ?? rawPost.reposted_by_auth),
    isSaved: booleanValue(rawPost.is_saved_by_auth ?? rawPost.is_saved ?? rawPost.saved_by_auth),
    isHidden: booleanValue(rawPost.is_hidden_by_auth ?? rawPost.is_hidden ?? rawPost.hidden_by_auth),
    isDeleted: booleanValue(rawPost.deleted ?? rawPost.is_deleted),
    isUnavailable: booleanValue(rawPost.unavailable ?? rawPost.is_unavailable),
    replyPermission: firstString(rawPost, ["reply_permission"]),
    topicName: firstString(rawPost, ["topic_name", "topic"]),
  };
}

function extractCollection(response: unknown) {
  if (Array.isArray(response)) {
    return { items: response, meta: undefined };
  }

  if (!isRecord(response)) {
    return { items: [], meta: undefined };
  }

  const data = response.data;
  if (Array.isArray(data)) {
    return { items: data, meta: response };
  }

  if (isRecord(data)) {
    if (Array.isArray(data.data)) {
      return { items: data.data, meta: data };
    }

    const nestedItems = nestedArray(data, ["posts", "items", "results"]);
    if (nestedItems.length > 0) {
      return { items: nestedItems, meta: data };
    }
  }

  const directItems = nestedArray(response, ["posts", "items", "results"]);
  return { items: directItems, meta: response };
}

function mapPageInfo(meta: unknown, requestedPage: number, requestedPerPage: number, itemCount: number): PageInfo {
  const metaRecord = isRecord(meta) ? meta : {};
  const currentPage = firstNumber(metaRecord, ["current_page", "currentPage", "page"]) ?? requestedPage;
  const perPage = firstNumber(metaRecord, ["per_page", "perPage", "limit"]) ?? requestedPerPage;
  const lastPage = firstNumber(metaRecord, ["last_page", "lastPage", "total_pages", "totalPages"]);
  const nextPageUrl = firstString(metaRecord, ["next_page_url", "nextPageUrl"]);
  const explicitHasNext = metaRecord.has_more ?? metaRecord.hasMore ?? metaRecord.has_next_page ?? metaRecord.hasNextPage;

  const hasNextPage =
    typeof explicitHasNext !== "undefined"
      ? booleanValue(explicitHasNext)
      : Boolean(nextPageUrl) || (lastPage ? currentPage < lastPage : itemCount >= perPage);

  return {
    currentPage,
    perPage,
    hasNextPage,
    nextPage: hasNextPage ? currentPage + 1 : undefined,
  };
}

export function mapPaginatedPosts(response: unknown, requestedPage: number, requestedPerPage: number): PaginatedPosts {
  const { items, meta } = extractCollection(response);
  const posts = items.map(mapPost);

  return {
    posts,
    pageInfo: mapPageInfo(meta, requestedPage, requestedPerPage, posts.length),
  };
}
