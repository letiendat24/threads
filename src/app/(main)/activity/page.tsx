import type { Metadata } from "next";

import { NotificationsView } from "@/features/notifications/components/notifications-view";

export const metadata: Metadata = {
  title: "Activity",
  description: "Review your Soi chi city notifications and recent activity.",
  alternates: {
    canonical: "/activity",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivityPage() {
  return <NotificationsView />;
}
