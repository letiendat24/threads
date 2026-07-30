import { mapUserProfiles } from "@/features/profiles/utils/profile-mappers";

import type { SearchResults, SearchTopic } from "@/features/search/types/search-types";

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

function nestedArray(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function unwrapRecord(response: unknown) {
  if (!isRecord(response)) {
    return {};
  }

  const data = response.data;

  if (isRecord(data)) {
    return data;
  }

  return response;
}

function mapTopic(value: unknown, index: number): SearchTopic | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return {
      id: value,
      name: value,
    };
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const name = stringValue(value.name) ?? stringValue(value.title) ?? stringValue(value.topic);
  if (!name) {
    return undefined;
  }

  return {
    id: String(numberValue(value.id) ?? stringValue(value.id) ?? stringValue(value.slug) ?? `${name}-${index}`),
    name,
    postsCount: numberValue(value.posts_count ?? value.post_count ?? value.threads_count),
  };
}

export function mapSearchResults(response: unknown): SearchResults {
  const data = unwrapRecord(response);
  const users = mapUserProfiles({
    data: nestedArray(data, ["users", "people", "accounts"]),
  });
  const topics = nestedArray(data, ["topics", "tags", "hashtags"])
    .map(mapTopic)
    .filter((topic): topic is SearchTopic => Boolean(topic));

  return {
    users,
    topics,
  };
}
