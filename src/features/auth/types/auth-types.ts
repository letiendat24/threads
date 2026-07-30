export interface AuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthUser {
  id: string | number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
  bio?: string | null;
  is_private?: boolean | number | null;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ValidateUsernameRequest {
  username: string;
}

export interface ValidateEmailRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface UpdateColumnsRequest {
  columns: string[];
}

export interface DeleteAccountRequest {
  _method: "DELETE";
}

export interface UpdateProfileRequest {
  name: string;
  username: string;
  bio?: string;
  avatar?: File | null;
  is_private?: boolean;
}

export interface ApiMessageResponse {
  message?: string;
  status?: string;
  [key: string]: unknown;
}
