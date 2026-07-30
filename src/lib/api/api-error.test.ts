import axios from "axios";
import { describe, expect, it } from "vitest";

import { AppError, normalizeApiError } from "@/lib/api/api-error";

describe("normalizeApiError", () => {
  it("keeps AppError instances intact", () => {
    const error = new AppError({ code: "FORBIDDEN", message: "No access", status: 403 });

    expect(normalizeApiError(error)).toBe(error);
  });

  it("normalizes Axios response errors", () => {
    const error = new axios.AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        config: { headers: new axios.AxiosHeaders() },
        data: { message: "Invalid input", errors: { email: ["Email is required"] } },
        headers: {},
        status: 422,
        statusText: "Unprocessable Entity",
      },
    );

    const normalized = normalizeApiError(error);

    expect(normalized).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid input",
      status: 422,
      fieldErrors: { email: "Email is required" },
    });
  });

  it("normalizes unknown values", () => {
    const normalized = normalizeApiError("broken");

    expect(normalized).toMatchObject({
      code: "UNKNOWN",
      message: "An unexpected error occurred.",
    });
  });
});
