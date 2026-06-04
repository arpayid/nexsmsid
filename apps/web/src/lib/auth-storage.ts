import type { AuthTokens, AuthUser } from "@nexsmsid/api-client";

const storageKeys = {
  accessToken: "nexsmsid.accessToken",
  refreshToken: "nexsmsid.refreshToken",
  user: "nexsmsid.user"
};

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKeys.accessToken);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKeys.refreshToken);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(storageKeys.user);

  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export function storeAuthTokens(tokens: AuthTokens) {
  window.localStorage.setItem(storageKeys.accessToken, tokens.accessToken);
  window.localStorage.setItem(storageKeys.refreshToken, tokens.refreshToken);
  window.localStorage.setItem(storageKeys.user, JSON.stringify(tokens.user));
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKeys.accessToken);
  window.localStorage.removeItem(storageKeys.refreshToken);
  window.localStorage.removeItem(storageKeys.user);
}
