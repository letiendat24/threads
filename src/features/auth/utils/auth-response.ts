import type { AuthTokenResponse } from "@/features/auth/types/auth-types";

export function hasAuthTokens(response: AuthTokenResponse): response is AuthTokenResponse & {
  access_token: string;
} {
  return typeof response.access_token === "string" && response.access_token.length > 0;
}
