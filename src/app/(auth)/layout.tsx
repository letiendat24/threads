import type { ReactNode } from "react";

import { GuestOnlyRoute } from "@/features/auth/components/auth-guards";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
}
