import { VerifiedBadge } from "@/components/shared/verified-badge";
import { cn } from "@/lib/utils";

interface UserNameProps {
  name: string;
  username?: string;
  verified?: boolean;
  className?: string;
}

export function UserName({ name, username, verified = false, className }: UserNameProps) {
  return (
    <span className={cn("inline-flex min-w-0 flex-col", className)}>
      <span className="inline-flex min-w-0 items-center gap-1">
        <span className="truncate text-display-name text-foreground">{name}</span>
        {verified ? <VerifiedBadge /> : null}
      </span>
      {username ? <span className="truncate text-username text-muted-foreground">@{username}</span> : null}
    </span>
  );
}
