import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <section className="max-w-sm text-center">
        <p className="text-metadata text-muted-foreground">404</p>
        <h1 className="mt-2 text-page-title text-foreground">Page not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          This route is not available in the current frontend foundation.
        </p>
        <Button asChild className="mt-5">
          <Link href="/">Go home</Link>
        </Button>
      </section>
    </main>
  );
}
