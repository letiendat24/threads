import { HomeFeedShell } from "@/features/feed/components/home-feed-shell";
import type { FeedType } from "@/features/feed/types/feed-types";

interface HomePageProps {
  searchParams: Promise<{
    feed?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeFeed: FeedType = params.feed === "following" ? "following" : "for_you";

  return <HomeFeedShell activeType={activeFeed} />;
}
