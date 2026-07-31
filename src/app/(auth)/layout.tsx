import type { Metadata } from "next";
import type { ReactNode } from "react";

import { GuestOnlyRoute } from "@/features/auth/components/auth-guards";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
}
