import api from "./api";

const getCurrentLanguage = () => {
  const locale = localStorage.getItem("app_language");

  return locale;
};

const reservationService = {
  createReservation: (body) =>
    api.post("/reservation", {
      ...body,
      language: getCurrentLanguage(),
    }),
  getAll: () => api.get("/reservation"),
  acceptReservation: (id) => api.patch(`/reservation/${id}/accept`),
  rejectReservation: (id) => api.patch(`/reservation/${id}/reject`),
};

export default reservationService;
