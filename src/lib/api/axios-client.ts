import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { normalizeApiError } from "@/lib/api/api-error";
import { getAccessToken } from "@/lib/api/auth-token-storage";
import { refreshSession } from "@/lib/api/refresh-token";

const DEFAULT_API_TIMEOUT = 15_000;

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

function isRetriableRequestConfig(config: InternalAxiosRequestConfig | undefined): config is RetriableRequestConfig {
  return Boolean(config);
}

function ensureHeaders(config: InternalAxiosRequestConfig) {
  const headers = AxiosHeaders.from(config.headers);

  headers.set("Accept", "application/json");

  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(config.data instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  config.headers = headers;

  return config;
}

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: DEFAULT_API_TIMEOUT,
  withCredentials: false,
});

axiosClient.interceptors.request.use(ensureHeaders);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = isRetriableRequestConfig(error.config) ? error.config : undefined;

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.skipAuthRefresh) {
      originalRequest._retry = true;

      const refreshed = await refreshSession();

      if (refreshed) {
        return axiosClient.request(originalRequest);
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
