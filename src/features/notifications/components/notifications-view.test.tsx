import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NotificationsView } from "@/features/notifications/components/notifications-view";

describe("NotificationsView", () => {
  it("renders the API blocker state", () => {
    render(<NotificationsView />);

    expect(screen.getByText("Notifications need API support")).toBeInTheDocument();
    expect(screen.getByText(/mark-as-read endpoints are not documented/i)).toBeInTheDocument();
  });
});
