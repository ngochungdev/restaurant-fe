import api from "./api";

const removeEmptyFields = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== "" && value != null),
  );

const leadService = {
  create: async (body) => {
    const res = await api.post("/leads", removeEmptyFields(body), {
      skipAuth: true,
    });

    return res.data;
  },
};

export default leadService;
