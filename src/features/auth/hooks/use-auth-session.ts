"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { hasAuthTokens } from "@/features/auth/utils/auth-response";
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/lib/api/auth-token-storage";
import { setRefreshSessionHandler } from "@/lib/api/refresh-token";
import { queryKeys } from "@/lib/query/query-keys";
import { AuthService } from "@/services/AuthService";
import { useUiStore } from "@/stores/ui-store";

export function useCurrentUserQuery() {
  const hasToken = Boolean(getAccessToken());

  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: ({ signal }) => AuthService.getCurrentUser({ signal }),
    enabled: hasToken,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (response) => {
      if (hasAuthTokens(response)) {
        setAuthTokens({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        });
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
      router.replace("/");
      toast.success("Logged in successfully.");
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: async (response) => {
      if (hasAuthTokens(response)) {
        setAuthTokens({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        });
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
        router.replace("/");
      } else {
        router.replace("/login");
      }

      toast.success("Account created.");
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetUiState = useUiStore((state) => state.resetUiState);

  return useMutation({
    mutationFn: AuthService.logout,
    onSettled: async () => {
      clearAuthTokens();
      resetUiState();
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      router.replace("/login");
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetUiState = useUiStore((state) => state.resetUiState);

  return useMutation({
    mutationFn: () => AuthService.deleteAccount(),
    onSuccess: async () => {
      clearAuthTokens();
      resetUiState();
      queryClient.clear();
      router.replace("/login");
      toast.success("Account deleted.");
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => toast.success("Password reset email sent."),
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully.");
      router.replace("/login");
    },
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: () => toast.success("Email verified."),
  });
}

export function useResendVerificationEmailMutation() {
  return useMutation({
    mutationFn: AuthService.resendVerificationEmail,
    onSuccess: () => toast.success("Verification email sent."),
  });
}

export function useInstallRefreshHandler() {
  useEffect(() => {
    setRefreshSessionHandler(async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthTokens();
        throw new Error("Missing refresh token.");
      }

      const response = await AuthService.refresh({ refresh_token: refreshToken });

      if (!hasAuthTokens(response)) {
        clearAuthTokens();
        throw new Error("Invalid refresh response.");
      }

      setAuthTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token ?? refreshToken,
      });
    });

    return () => setRefreshSessionHandler(undefined);
  }, []);
}
