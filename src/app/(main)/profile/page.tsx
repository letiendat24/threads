import type { Metadata } from "next";

import { CurrentProfileView } from "@/features/profiles/components/current-profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Soi chi city profile.",
  alternates: {
    canonical: "/profile",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <CurrentProfileView />;
}
