import { create } from "zustand";

const storedUser = localStorage.getItem("user");

const useAuthStore = create((set) => ({
  user:
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,

  token: localStorage.getItem("token") || null,

  isAuthenticated: !!localStorage.getItem("token"),

  login: (data) => {
    localStorage.setItem("token", data.access_token);

    localStorage.setItem("user", JSON.stringify(data.user));

    set({
      token: data.access_token,
      user: data.user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
