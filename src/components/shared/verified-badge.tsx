import { BadgeCheck } from "lucide-react";

export function VerifiedBadge() {
  return (
    <span title="Verified" aria-label="Verified" className="inline-flex text-foreground">
      <BadgeCheck className="size-4" aria-hidden="true" />
    </span>
  );
}
