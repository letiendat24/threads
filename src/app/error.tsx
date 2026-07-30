"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void error.digest;
  }, [error.digest]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <ErrorState
        title="Something went wrong"
        description="The app could not render this view."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </main>
  );
}
