import type { ReactNode } from "react";

import { ComposerPlaceholder } from "@/components/shared/composer-placeholder";
import { DesktopSidebar } from "@/components/shared/desktop-sidebar";
import { MobileBottomNavigation } from "@/components/shared/mobile-bottom-navigation";
import { MobileHeader } from "@/components/shared/mobile-header";
import { NetworkStatusBanner } from "@/components/shared/network-status-banner";
import { RightSidebar } from "@/components/shared/right-sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileHeader />
      <NetworkStatusBanner />
      <div className="mx-auto flex w-full max-w-shell">
        <DesktopSidebar />
        <main className="min-h-screen w-full min-w-0 rounded-md bg-background pb-mobile-nav md:max-w-feed md:pb-0">
          {children}
        </main>
        <RightSidebar />
      </div>
      <MobileBottomNavigation />
      <ComposerPlaceholder />
    </div>
  );
}
