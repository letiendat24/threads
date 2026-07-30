import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { AppError } from "@/lib/api/api-error";

export function applyServerFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
) {
  if (!(error instanceof AppError) || !error.fieldErrors) {
    return;
  }

  for (const [field, message] of Object.entries(error.fieldErrors)) {
    setError(field as Path<TFieldValues>, {
      type: "server",
      message,
    });
  }
}

export function getServerErrorMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
}
