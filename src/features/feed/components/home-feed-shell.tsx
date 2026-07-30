"use client";

import { useEffect, useRef } from "react";

import { FeedComposerEntry } from "@/features/feed/components/feed-composer-entry";
import { FeedList } from "@/features/feed/components/feed-list";
import { FeedTabs } from "@/features/feed/components/feed-tabs";
import type { FeedType } from "@/features/feed/types/feed-types";

interface HomeFeedShellProps {
  activeType: FeedType;
}

function getWheelDelta(event: WheelEvent, viewportHeight: number) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * viewportHeight;
  }

  return event.deltaY;
}

function hasScrollableAncestorOutsideFeed(target: EventTarget | null, feedElement: HTMLElement) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest("[role='dialog'], [data-radix-popper-content-wrapper]")) {
    return true;
  }

  let current: Element | null = target;

  while (current && current !== document.body) {
    if (current === feedElement) {
      return false;
    }

    const style = window.getComputedStyle(current);
    const canScroll = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;

    if (canScroll) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

export function HomeFeedShell({ activeType }: HomeFeedShellProps) {
  const feedScrollRef = useRef<HTMLDivElement | null>(null);
  const wheelDeltaRef = useRef(0);
  const wheelFrameRef = useRef<number | null>(null);

  useEffect(() => {
    function flushWheelDelta() {
      const feedElement = feedScrollRef.current;

      wheelFrameRef.current = null;

      if (!feedElement) {
        wheelDeltaRef.current = 0;
        return;
      }

      const maxScrollTop = feedElement.scrollHeight - feedElement.clientHeight;
      const nextScrollTop = Math.min(maxScrollTop, Math.max(0, feedElement.scrollTop + wheelDeltaRef.current));

      wheelDeltaRef.current = 0;
      feedElement.scrollTop = nextScrollTop;
    }

    function handleWindowWheel(event: WheelEvent) {
      const feedElement = feedScrollRef.current;

      if (
        !feedElement ||
        event.defaultPrevented ||
        event.ctrlKey ||
        event.deltaY === 0 ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        return;
      }

      if (event.target instanceof Node && feedElement.contains(event.target)) {
        return;
      }

      if (hasScrollableAncestorOutsideFeed(event.target, feedElement)) {
        return;
      }

      const maxScrollTop = feedElement.scrollHeight - feedElement.clientHeight;

      if (maxScrollTop <= 0) {
        return;
      }

      event.preventDefault();
      wheelDeltaRef.current += getWheelDelta(event, feedElement.clientHeight);

      if (wheelFrameRef.current === null) {
        wheelFrameRef.current = window.requestAnimationFrame(flushWheelDelta);
      }
    }

    window.addEventListener("wheel", handleWindowWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWindowWheel);

      if (wheelFrameRef.current !== null) {
        window.cancelAnimationFrame(wheelFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col md:h-screen">
      <header className="shrink-0 bg-background/92 backdrop-blur">
        <h1 className="sr-only">Home</h1>
        <FeedTabs activeType={activeType} />
      </header>
      <div className="min-h-0 flex-1 px-3 pt-3 md:px-4 overflow-hidden">
        <section
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-t-xl border-x border-t border-border bg-surface"
          aria-label="Home feed content"
        >
          <div
            ref={feedScrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <FeedComposerEntry />
            <FeedList type={activeType} />
          </div>
        </section>
      </div>
    </div>
  );
}
