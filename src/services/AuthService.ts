import { axiosClient } from "@/lib/api/axios-client";

import type {
  ApiMessageResponse,
  AuthTokenResponse,
  AuthUser,
  DeleteAccountRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateColumnsRequest,
  UpdateProfileRequest,
  ValidateEmailRequest,
  ValidateResetTokenRequest,
  ValidateUsernameRequest,
  VerifyEmailRequest,
} from "@/features/auth/types/auth-types";

type ApiEnvelope<T> = T | { data: T; message?: string; status?: string };

function unwrapApiData<T>(response: ApiEnvelope<T>): T {
  if (typeof response === "object" && response !== null && "data" in response) {
    return response.data;
  }

  return response;
}

function getBrowserOrigin() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.origin;
}

function originHeaders() {
  const origin = getBrowserOrigin();

  return origin ? { "x-origin": origin } : undefined;
}

export class AuthService {
  static async register(payload: RegisterRequest) {
    const response = await axiosClient.post<ApiEnvelope<AuthTokenResponse>>("/api/auth/register", payload, {
      headers: originHeaders(),
    });

    return unwrapApiData(response.data);
  }

  static async login(payload: LoginRequest) {
    const response = await axiosClient.post<ApiEnvelope<AuthTokenResponse>>("/api/auth/login", payload);

    return unwrapApiData(response.data);
  }

  static async refresh(payload: RefreshTokenRequest) {
    const response = await axiosClient.post<ApiEnvelope<AuthTokenResponse>>("/api/auth/refresh", payload, {
      skipAuthRefresh: true,
    });

    return unwrapApiData(response.data);
  }

  static async validateUsername(payload: ValidateUsernameRequest) {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/validate/username",
      payload,
    );

    return unwrapApiData(response.data);
  }

  static async validateEmail(payload: ValidateEmailRequest) {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/validate/email",
      payload,
    );

    return unwrapApiData(response.data);
  }

  static async forgotPassword(payload: ForgotPasswordRequest) {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/forgot-password",
      payload,
      {
        headers: originHeaders(),
      },
    );

    return unwrapApiData(response.data);
  }

  static async validateResetToken(payload: ValidateResetTokenRequest) {
    const response = await axiosClient.get<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/reset-password/validate",
      {
        params: payload,
      },
    );

    return unwrapApiData(response.data);
  }

  static async resetPassword(payload: ResetPasswordRequest) {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/reset-password",
      payload,
    );

    return unwrapApiData(response.data);
  }

  static async getCurrentUser({ signal }: { signal?: AbortSignal } = {}) {
    const response = await axiosClient.get<ApiEnvelope<AuthUser>>("/api/auth/user", { signal });

    return unwrapApiData(response.data);
  }

  static async logout() {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>("/api/auth/logout");

    return unwrapApiData(response.data);
  }

  static async verifyEmail(payload: VerifyEmailRequest) {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/verify-email",
      payload,
    );

    return unwrapApiData(response.data);
  }

  static async resendVerificationEmail() {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/resend-verification-email",
      undefined,
      {
        headers: originHeaders(),
      },
    );

    return unwrapApiData(response.data);
  }

  static async deleteAccount(payload: DeleteAccountRequest = { _method: "DELETE" }) {
    const response = await axiosClient.post<ApiEnvelope<ApiMessageResponse>>(
      "/api/auth/account",
      payload,
    );

    return unwrapApiData(response.data);
  }

  static async getColumns({ signal }: { signal?: AbortSignal } = {}) {
    const response = await axiosClient.get<ApiEnvelope<string[]>>("/api/auth/columns", { signal });

    return unwrapApiData(response.data);
  }

  static async updateColumns(payload: UpdateColumnsRequest) {
    const response = await axiosClient.post<ApiEnvelope<string[]>>("/api/auth/columns", {
      _method: "PUT",
      columns: payload.columns,
    });

    return unwrapApiData(response.data);
  }

  static async updateProfile(payload: UpdateProfileRequest) {
    const formData = new FormData();
    formData.set("_method", "PUT");
    formData.set("name", payload.name);
    formData.set("username", payload.username);
    formData.set("bio", payload.bio ?? "");

    if (typeof payload.is_private === "boolean") {
      formData.set("is_private", payload.is_private ? "1" : "0");
    }

    if (payload.avatar) {
      formData.set("avatar", payload.avatar);
    }

    const response = await axiosClient.post<ApiEnvelope<AuthUser>>("/api/auth/profile", formData);

    return unwrapApiData(response.data);
  }
}
