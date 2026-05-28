import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),

  login: async (data) => {
    const res = await api.post("/auth/login", data);

    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  },
};
