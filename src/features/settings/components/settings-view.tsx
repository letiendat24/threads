import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { SessionSummary } from "@/features/auth/components/session-summary";
import { DeleteAccountDialog } from "@/features/settings/components/delete-account-dialog";
import { ThemeSettings } from "@/features/settings/components/theme-settings";

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border px-4 py-5">
      <div className="space-y-4">
        <div>
          <h2 className="text-section-title text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-body-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function SettingsView() {
  return (
    <>
      <PageHeader title="Settings" description="Preferences and account" />
      <SettingsSection title="Appearance" description="Choose how Threads looks on this device.">
        <ThemeSettings />
      </SettingsSection>
      <SettingsSection title="Account" description="Your active session and account actions.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SessionSummary />
          <div className="flex flex-wrap gap-2">
            <LogoutButton />
            <DeleteAccountDialog />
          </div>
        </div>
      </SettingsSection>
      <SettingsSection title="Available settings" description="Only settings backed by documented APIs are shown as controls.">
        <div className="flex gap-3 rounded-lg border border-border bg-background p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-body-sm text-muted-foreground">
            Privacy preferences, notification preferences, muted users, and blocked users need list or settings
            endpoints before they can become editable settings.
          </p>
        </div>
      </SettingsSection>
    </>
  );
}
