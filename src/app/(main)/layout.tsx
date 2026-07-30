import type { ReactNode } from "react";

import { AppShell } from "@/components/shared/app-shell";
import { AuthenticatedRoute } from "@/features/auth/components/auth-guards";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedRoute>
      <AppShell>{children}</AppShell>
    </AuthenticatedRoute>
  );
}
