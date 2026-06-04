import { create } from "zustand";
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "../utils/authTokens";

const storedUser = localStorage.getItem("user");

const useAuthStore = create((set) => ({
  user:
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,

  token: getAccessToken(),
  refreshToken: getRefreshToken(),

  isAuthenticated: !!getAccessToken(),

  login: (data) => {
    setAuthTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    localStorage.setItem("user", JSON.stringify(data.user));

    set({
      token: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user,
      isAuthenticated: true,
    });
  },

  updateSession: (data) => {
    setAuthTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    set((state) => ({
      token: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user || state.user,
      isAuthenticated: true,
    }));
  },

  logout: () => {
    clearAuthTokens();
    localStorage.removeItem("user");

    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
