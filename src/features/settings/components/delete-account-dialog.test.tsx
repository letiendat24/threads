import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteAccountDialog } from "@/features/settings/components/delete-account-dialog";

const deleteAccountMocks = vi.hoisted(() => ({
  mutation: {
    mutate: vi.fn(),
    isPending: false,
    error: null as Error | null,
  },
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useDeleteAccountMutation: () => deleteAccountMocks.mutation,
}));

describe("DeleteAccountDialog", () => {
  beforeEach(() => {
    deleteAccountMocks.mutation.mutate.mockReset();
    deleteAccountMocks.mutation.isPending = false;
    deleteAccountMocks.mutation.error = null;
  });

  it("confirms account deletion before calling the API mutation", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountDialog />);

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const dialog = await screen.findByRole("alertdialog");

    await user.click(within(dialog).getByRole("button", { name: "Delete account" }));

    expect(deleteAccountMocks.mutation.mutate).toHaveBeenCalledWith(undefined, {
      onSuccess: expect.any(Function),
    });
  });

  it("renders account deletion errors", async () => {
    const user = userEvent.setup();
    deleteAccountMocks.mutation.error = new Error("Could not delete account.");
    render(<DeleteAccountDialog />);

    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not delete account.");
  });
});
