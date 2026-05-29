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

  update: async (id, data) => {
    const res = await api.patch(`/menu/${id}`, data);

    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/menu/${id}`);

    return res.data;
  },
};

export default menuService;
