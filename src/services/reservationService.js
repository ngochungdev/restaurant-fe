import api from "./api";

const reservationService = {
  createReservation: (body) => api.post("/reservation", body),
  getAll: () => api.get("/reservation"),
  acceptReservation: (id) => api.patch(`/reservation/${id}/accept`),
  rejectReservation: (id) => api.patch(`/reservation/${id}/reject`),
};

export default reservationService;
