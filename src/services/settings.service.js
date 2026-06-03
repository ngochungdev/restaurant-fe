import api from "./api";

const settingsService = {
  getCurrent: async () => {
    const res = await api.get("/settings/current", { skipAuth: true });

    return res.data;
  },

  updateCurrent: async (data) => {
    const res = await api.patch("/settings/current", data);

    return res.data;
  },
};

export default settingsService;
