import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NetworkStatusBanner } from "@/components/shared/network-status-banner";

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

describe("NetworkStatusBanner", () => {
  afterEach(() => {
    setNavigatorOnline(true);
  });

  it("announces the offline state", async () => {
    setNavigatorOnline(false);

    render(<NetworkStatusBanner />);

    expect(await screen.findByRole("status")).toHaveTextContent("You are offline.");
  });

  it("clears when the browser comes back online", async () => {
    setNavigatorOnline(false);
    render(<NetworkStatusBanner />);

    expect(await screen.findByRole("status")).toBeInTheDocument();

    setNavigatorOnline(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});
