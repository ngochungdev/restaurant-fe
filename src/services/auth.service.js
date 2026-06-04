import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),

  login: async (data) => {
    const res = await api.post("/auth/login", data);

    return res.data;
  },

  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
};
