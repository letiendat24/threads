import type { Metadata } from "next";

import { SearchView } from "@/features/search/components/search-view";

export const metadata: Metadata = {
  title: "Search",
  description: "Search people and topics on Soi chi city.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchPage() {
  return <SearchView />;
}
