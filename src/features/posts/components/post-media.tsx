import Image from "next/image";

import { cn } from "@/lib/utils";

import type { PostMedia as PostMediaItem } from "@/features/posts/types/post-types";

interface PostMediaProps {
  media: PostMediaItem[];
}

export function PostMedia({ media }: PostMediaProps) {
  if (media.length === 0) {
    return null;
  }

  const visibleMedia = media.slice(0, 4);

  return (
    <div
      className={cn(
        "mt-3 grid overflow-hidden rounded-lg border border-border bg-surface",
        visibleMedia.length === 1 ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {visibleMedia.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "relative min-h-44 overflow-hidden bg-muted",
            visibleMedia.length > 1 && "aspect-square min-h-0",
            visibleMedia.length > 1 && index > 0 && "border-l border-border",
            visibleMedia.length > 2 && index > 1 && "border-t border-border",
            visibleMedia.length === 3 && index === 0 && "row-span-2",
          )}
        >
          {item.type === "video" ? (
            <video
              className="size-full object-cover"
              controls
              preload="metadata"
              poster={item.thumbnailUrl}
              aria-label={item.alt}
            >
              <source src={item.url} />
            </video>
          ) : (
            <Image
              src={item.url}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 92vw, 560px"
            />
          )}
        </div>
      ))}
    </div>
  );
}
