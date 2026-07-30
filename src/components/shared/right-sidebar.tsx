import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { SessionSummary } from "@/features/auth/components/session-summary";

export function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-right-sidebar shrink-0 bg-background p-4 lg:block">
      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-section-title text-foreground">Session</h2>
        <div className="mt-3">
          <SessionSummary />
        </div>
        <LogoutButton className="mt-4 w-full" />
      </section>
      <section className="mt-4 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-section-title text-foreground">API status</h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          The interface is ready for real endpoints. Data-driven modules stay empty until the backend
          contract is added.
        </p>
      </section>
      <section className="mt-4 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-section-title text-foreground">Appearance</h2>
        <div className="mt-3">
          <ThemeSwitcher />
        </div>
      </section>
    </aside>
  );
}
