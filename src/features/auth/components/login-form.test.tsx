import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/lib/api/api-error";

import { LoginForm } from "@/features/auth/components/login-form";

const authMocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
}));

vi.mock("@/features/auth/hooks/use-auth-session", () => ({
  useLoginMutation: () => ({
    mutateAsync: authMocks.mutateAsync,
    isPending: false,
    error: null,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    authMocks.mutateAsync.mockReset();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Email or username is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(authMocks.mutateAsync).not.toHaveBeenCalled();
  });

  it("submits login credentials", async () => {
    const user = userEvent.setup();
    authMocks.mutateAsync.mockResolvedValueOnce({
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email or username"), "letiendat");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(authMocks.mutateAsync).toHaveBeenCalledWith({
        login: "letiendat",
        password: "password123",
      });
    });
  });

  it("renders server field errors", async () => {
    const user = userEvent.setup();
    authMocks.mutateAsync.mockRejectedValueOnce(
      new AppError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials.",
        status: 401,
        fieldErrors: {
          login: "The login is invalid.",
        },
      }),
    );
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email or username"), "wrong-user");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("The login is invalid.")).toBeInTheDocument();
  });
});
