import { AppLogo } from "@/components/shared/app-logo";
import { NavItem } from "@/components/shared/nav-item";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { primaryNavigationItems, secondaryNavigationItems } from "@/config/navigation";

export function DesktopSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-desktop-sidebar shrink-0 flex-col justify-between bg-background px-3 py-4 md:flex">
      <div className="space-y-8">
        <AppLogo />
        <nav aria-label="Primary navigation" className="space-y-1">
          {primaryNavigationItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        <nav aria-label="Secondary navigation" className="space-y-1">
          {secondaryNavigationItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>
        <div className="px-1">
          <ThemeSwitcher />
        </div>
      </div>
    </aside>
  );
}
