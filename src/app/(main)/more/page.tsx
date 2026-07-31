import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "More",
  description: "Access additional Soi chi city actions.",
  alternates: {
    canonical: "/more",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function MorePage() {
  return (
    <>
      <PageHeader title="More" description="Additional app actions" />
      <div className="p-4">
        <EmptyState
          title="More actions are not configured"
          description="This route keeps the navigation structure complete without assuming backend support."
        />
      </div>
    </>
  );
}
