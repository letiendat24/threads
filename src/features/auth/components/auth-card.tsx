import type { ReactNode } from "react";

import { AppLogo } from "@/components/shared/app-logo";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-5">
        <div className="mb-6 flex justify-center">
          <AppLogo />
        </div>
        <h1 className="text-page-title text-foreground">{title}</h1>
        <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-5 border-t border-border pt-4 text-center">{footer}</div> : null}
      </section>
    </main>
  );
}
