import axios, { type AxiosError } from "axios";

export type AppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface AppErrorPayload {
  code: AppErrorCode;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;
  readonly fieldErrors?: Record<string, string>;

  constructor({ code, message, status, fieldErrors }: AppErrorPayload) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getMessage(data: unknown) {
  if (isRecord(data) && typeof data.message === "string") {
    return data.message;
  }

  if (isRecord(data) && typeof data.error === "string") {
    return data.error;
  }

  return undefined;
}

function getFieldErrors(data: unknown) {
  if (!isRecord(data) || !isRecord(data.errors)) {
    return undefined;
  }

  return Object.entries(data.errors).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "string") {
      acc[key] = value;
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      acc[key] = value[0];
    }

    return acc;
  }, {});
}

function codeFromStatus(status?: number): AppErrorCode {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMITED";
    default:
      if (status && status >= 500) {
        return "SERVER_ERROR";
      }

      return "UNKNOWN";
  }
}

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error);
  }

  if (error instanceof Error) {
    return new AppError({
      code: "UNKNOWN",
      message: error.message || "An unexpected error occurred.",
    });
  }

  return new AppError({
    code: "UNKNOWN",
    message: "An unexpected error occurred.",
  });
}

function normalizeAxiosError(error: AxiosError): AppError {
  const status = error.response?.status;
  const data = error.response?.data;
  const message =
    getMessage(data) ??
    (status ? "The server could not complete the request." : "Unable to reach the server.");

  return new AppError({
    code: status ? codeFromStatus(status) : "NETWORK_ERROR",
    message,
    status,
    fieldErrors: getFieldErrors(data),
  });
}
