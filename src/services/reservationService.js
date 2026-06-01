import api from "./api";

const getCurrentLanguage = () => {
  const locale = localStorage.getItem("app_language");

  return locale;
};

const removeEmptyFields = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== "" && value != null),
  );

const reservationService = {
  createReservation: (body) =>
    api.post(
      "/reservation",
      removeEmptyFields({
        ...body,
        language: getCurrentLanguage(),
      }),
      { skipAuth: true },
    ),
  getAll: () => api.get("/reservation"),
  acceptReservation: (id) => api.patch(`/reservation/${id}/accept`),
  rejectReservation: (id) => api.patch(`/reservation/${id}/reject`),
};

export default reservationService;
