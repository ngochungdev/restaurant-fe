import api from "./api";

const aboutUsService = {
  getCurrent: async () => {
    const res = await api.get("/about-us/current", { skipAuth: true });

    return res.data;
  },

  updateCurrent: async (data) => {
    const res = await api.patch("/about-us/current", data);

    return res.data;
  },
};

export default aboutUsService;
