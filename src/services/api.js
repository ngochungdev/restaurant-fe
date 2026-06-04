import axios from "axios";
import {
  clearSession,
  isAccessTokenExpired,
  notifySessionExpired,
  refreshSession,
} from "./auth-session.service";
import { getAccessToken, getRefreshToken } from "../utils/authTokens";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1/",
});

api.interceptors.request.use(async (config) => {
  let token = getAccessToken();

  if (token && !config.skipAuth && isAccessTokenExpired(token)) {
    try {
      const session = await refreshSession();
      token = session.access_token;
    } catch (error) {
      clearSession();
      notifySessionExpired();

      return Promise.reject(error);
    }
  }

  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest.skipAuth ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      notifySessionExpired();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await refreshSession();

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${session.access_token}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearSession();
      notifySessionExpired();

      return Promise.reject(refreshError);
    }
  },
);

export default api;
