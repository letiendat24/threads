import { cn } from "@/lib/utils";

interface PostContentProps {
  content: string;
  className?: string;
}

export function PostContent({ content, className }: PostContentProps) {
  if (!content.trim()) {
    return null;
  }

  return (
    <div className={cn("whitespace-pre-wrap break-words text-body text-foreground", className)}>
      {content}
    </div>
  );
}
