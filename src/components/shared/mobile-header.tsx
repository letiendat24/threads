import { AppLogo } from "@/components/shared/app-logo";
import { ComposerButton } from "@/components/shared/mobile-nav-actions";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-mobile-header items-center justify-between border-b border-border bg-background/92 px-3 backdrop-blur md:hidden">
      <AppLogo compact />
      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <ComposerButton />
      </div>
    </header>
  );
}
