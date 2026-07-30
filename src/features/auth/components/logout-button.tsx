"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth-session";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const logoutMutation = useLogoutMutation();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={logoutMutation.isPending}
      onClick={() => logoutMutation.mutate()}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {logoutMutation.isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}
