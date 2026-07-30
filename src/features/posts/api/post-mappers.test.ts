import { describe, expect, it } from "vitest";

import { mapPaginatedPosts, mapPost } from "@/features/posts/api/post-mappers";

describe("post mappers", () => {
  it("maps a single post response", () => {
    const post = mapPost({
      data: {
        id: 42,
        content: "Hello Threads",
        created_at: "2026-07-29T08:00:00.000Z",
        likes_count: 3,
        replies_count: 2,
        user: {
          id: 7,
          name: "Le Tien Dat",
          username: "letiendat",
          avatar_url: "https://threads.f8team.dev/avatar.png",
          is_verified: true,
        },
      },
    });

    expect(post).toMatchObject({
      id: "42",
      content: "Hello Threads",
      author: {
        id: "7",
        name: "Le Tien Dat",
        username: "letiendat",
        isVerified: true,
      },
      counts: {
        replies: 2,
        reposts: 0,
        likes: 3,
      },
    });
  });

  it("maps paginated posts and next page information", () => {
    const page = mapPaginatedPosts(
      {
        data: {
          data: [
            {
              id: "post-1",
              content: "First",
              author: { id: "u1", username: "dat" },
            },
          ],
          current_page: 1,
          last_page: 2,
          per_page: 20,
        },
      },
      1,
      20,
    );

    expect(page.posts).toHaveLength(1);
    expect(page.pageInfo).toEqual({
      currentPage: 1,
      perPage: 20,
      hasNextPage: true,
      nextPage: 2,
    });
  });
});
