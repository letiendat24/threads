import { FeedComposerEntry } from "@/features/feed/components/feed-composer-entry";
import { FeedList } from "@/features/feed/components/feed-list";
import { FeedTabs } from "@/features/feed/components/feed-tabs";
import type { FeedType } from "@/features/feed/types/feed-types";

interface HomeFeedShellProps {
  activeType: FeedType;
}

export function HomeFeedShell({ activeType }: HomeFeedShellProps) {
  return (
    <div className="home-feed-shell main-container relative min-h-[calc(100dvh-8rem)] md:min-h-screen">
      <header className="sticky top-mobile-header z-40 bg-background/92 backdrop-blur md:top-0">
        <h1 className="sr-only">Home</h1>
        <FeedTabs activeType={activeType} />
      </header>
      <div className="dynamic-columns relative">
        <div
          className="pointer-events-none sticky top-[6.75rem] z-30 h-[calc(100dvh-6.75rem)] px-3 md:top-12 md:h-[calc(100dvh-3rem)] md:px-4"
          aria-hidden="true"
        >
          <div className="h-full rounded-t-xl border-x border-t border-border" />
        </div>
        <section
          className="column relative z-10 -mt-[calc(100dvh-6.75rem)] px-3 pt-3 md:-mt-[calc(100dvh-3rem)] md:px-4"
          aria-label="Home feed content"
        >
          <div className="column-container min-h-[calc(100dvh-6.75rem)] overflow-hidden rounded-t-xl bg-surface md:min-h-[calc(100dvh-3rem)]">
            <FeedComposerEntry />
            <FeedList type={activeType} />
          </div>
        </section>
      </div>
    </div>
  );
}
