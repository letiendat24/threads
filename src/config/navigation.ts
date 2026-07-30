export type NavigationIconName =
  | "home"
  | "search"
  | "create"
  | "activity"
  | "profile"
  | "settings"
  | "more";

export type NavigationItem =
  | {
      type: "link";
      label: string;
      href: string;
      icon: NavigationIconName;
      exact?: boolean;
    }
  | {
      type: "action";
      label: string;
      action: "compose";
      icon: NavigationIconName;
    };

export const primaryNavigationItems: NavigationItem[] = [
  {
    type: "link",
    label: "Home",
    href: "/",
    icon: "home",
    exact: true,
  },
  {
    type: "link",
    label: "Search",
    href: "/search",
    icon: "search",
  },
  {
    type: "action",
    label: "Create",
    action: "compose",
    icon: "create",
  },
  {
    type: "link",
    label: "Activity",
    href: "/activity",
    icon: "activity",
  },
  {
    type: "link",
    label: "Profile",
    href: "/profile",
    icon: "profile",
  },
];

export const secondaryNavigationItems: NavigationItem[] = [
  {
    type: "link",
    label: "Settings",
    href: "/settings",
    icon: "settings",
  },
  {
    type: "link",
    label: "More",
    href: "/more",
    icon: "more",
  },
];
