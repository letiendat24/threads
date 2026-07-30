import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsView } from "@/features/settings/components/settings-view";

const settingsMocks = vi.hoisted(() => ({
  setTheme: vi.fn(),
  logout: {
    mutate: vi.fn(),
    isPending: false,
  },
  deleteAccount: {
    mutate: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "system",
    setTheme: settingsMocks.setTheme,
  }),
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useCurrentUserQuery: () => ({
    isLoading: false,
    data: {
      id: "user-1",
      name: "Le Tien Dat",
      username: "letiendat",
    },
  }),
  useDeleteAccountMutation: () => settingsMocks.deleteAccount,
  useLogoutMutation: () => settingsMocks.logout,
}));

describe("SettingsView", () => {
  beforeEach(() => {
    settingsMocks.setTheme.mockReset();
    settingsMocks.logout.mutate.mockReset();
    settingsMocks.deleteAccount.mutate.mockReset();
    settingsMocks.logout.isPending = false;
    settingsMocks.deleteAccount.isPending = false;
    settingsMocks.deleteAccount.error = null;
  });

  it("renders supported settings and API availability context", () => {
    render(<SettingsView />);

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /system/i })).toBeInTheDocument();
    expect(screen.getByText("Le Tien Dat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete account" })).toBeInTheDocument();
    expect(screen.getByText(/need list or settings endpoints/i)).toBeInTheDocument();
  });
});
