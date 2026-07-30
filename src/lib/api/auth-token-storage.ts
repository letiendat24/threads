const ACCESS_TOKEN_KEY = "threads.access_token";
const REFRESH_TOKEN_KEY = "threads.refresh_token";

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
}

function getSessionStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

export function getAccessToken() {
  if (memoryAccessToken) {
    return memoryAccessToken;
  }

  const storage = getSessionStorage();
  memoryAccessToken = storage?.getItem(ACCESS_TOKEN_KEY) ?? null;

  return memoryAccessToken;
}

export function getRefreshToken() {
  if (memoryRefreshToken) {
    return memoryRefreshToken;
  }

  const storage = getSessionStorage();
  memoryRefreshToken = storage?.getItem(REFRESH_TOKEN_KEY) ?? null;

  return memoryRefreshToken;
}

export function setAuthTokens({ accessToken, refreshToken }: AuthTokens) {
  memoryAccessToken = accessToken;
  memoryRefreshToken = refreshToken ?? null;

  const storage = getSessionStorage();
  storage?.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    storage?.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    storage?.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearAuthTokens() {
  memoryAccessToken = null;
  memoryRefreshToken = null;

  const storage = getSessionStorage();
  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
}
