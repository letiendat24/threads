"use client";

import type { ReactNode } from "react";

import { useInstallRefreshHandler } from "@/features/auth/hooks/use-auth-session";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  useInstallRefreshHandler();

  return children;
}
