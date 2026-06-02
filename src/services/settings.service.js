import api from "./api";

const settingsService = {
  getCurrent: async () => {
    const res = await api.get("/settings/current", { skipAuth: true });

    return res.data;
  },
};

export default settingsService;
