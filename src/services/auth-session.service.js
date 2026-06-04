import axios from "axios";
import { toast } from "sonner";
import useAuthStore from "../stores/auth.store";
import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from "../utils/authTokens";

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1/",
});

let refreshPromise = null;
let sessionExpiredNotified = false;

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(window.atob(normalizedPayload));
  } catch {
    return null;
  }
};

export const isAccessTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now();
};

export const refreshSession = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  refreshPromise =
    refreshPromise ||
    refreshApi
      .post("/auth/refresh", { refreshToken })
      .then((response) => response.data)
      .finally(() => {
        refreshPromise = null;
      });

  const session = await refreshPromise;

  if (import.meta.env.DEV) {
    console.info("[auth] access token refreshed");
  }

  setAuthTokens({
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  });
  useAuthStore.getState().updateSession(session);

  return session;
};

export const notifySessionExpired = () => {
  if (sessionExpiredNotified) return;

  sessionExpiredNotified = true;
  toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

  window.setTimeout(() => {
    sessionExpiredNotified = false;
  }, 3000);
};

export const clearSession = () => {
  clearAuthTokens();
  localStorage.removeItem("user");
  useAuthStore.getState().logout();
};
