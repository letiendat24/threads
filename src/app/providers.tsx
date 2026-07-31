"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthSessionProvider } from "@/features/auth/components/auth-session-provider";
import { createQueryClient } from "@/lib/query/query-client";

import { SpeedInsights } from '@vercel/speed-insights/next';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthSessionProvider>
          <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
        </AuthSessionProvider>
        <Toaster
          position="bottom-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "border-border bg-surface-raised text-foreground",
              title: "text-foreground",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-secondary text-secondary-foreground",
            },
          }}
        />
      </ThemeProvider>
      <SpeedInsights />
    </QueryClientProvider>
  );
}
