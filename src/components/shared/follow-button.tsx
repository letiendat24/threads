"use client";

import { Button } from "@/components/ui/button";
import { useFollowUserMutation } from "@/features/social/hooks/use-follow-interactions";

interface FollowButtonProps {
  userId?: string;
  following?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function FollowButton({ userId, following = false, disabled = false, onClick }: FollowButtonProps) {
  const followMutation = useFollowUserMutation();
  const isDisabled = disabled || followMutation.isPending || (!onClick && !userId);

  return (
    <Button
      type="button"
      variant={following ? "outline" : "primary"}
      size="sm"
      disabled={isDisabled}
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }

        if (userId) {
          followMutation.mutate({ userId, following });
        }
      }}
      aria-pressed={following}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
