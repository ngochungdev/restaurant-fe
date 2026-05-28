import api from "./api";

const menuService = {
  getAll: async () => {
    const res = await api.get("/menu");

    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/menu", data);

    return res.data;
  },
};

export default menuService;
