import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeSettings } from "@/features/settings/components/theme-settings";

const themeMocks = vi.hoisted(() => ({
  theme: "system",
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: themeMocks.theme,
    setTheme: themeMocks.setTheme,
  }),
}));

describe("ThemeSettings", () => {
  beforeEach(() => {
    themeMocks.theme = "system";
    themeMocks.setTheme.mockReset();
  });

  it("shows the persisted theme selection", async () => {
    themeMocks.theme = "dark";

    render(<ThemeSettings />);

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /dark/i })).toBeChecked();
    });
  });

  it("updates theme through the accessible radio control", async () => {
    const user = userEvent.setup();
    render(<ThemeSettings />);

    await user.click(await screen.findByRole("radio", { name: /light/i }));

    expect(themeMocks.setTheme).toHaveBeenCalledWith("light");
  });
});
