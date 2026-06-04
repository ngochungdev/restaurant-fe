import api from "./api";

const categoryService = {
  getAll: async () => {
    const res = await api.get("/categories");

    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/categories", data);

    return res.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`/categories/${id}`, data);

    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);

    return res.data;
  },
};

export default categoryService;
