import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { connectSocket } from "../services/socket";

const DEFAULT_RESERVATION_EVENTS = [
  "reservations:updated",
  "reservation:created",
  "reservation:updated",
  "reservation:accepted",
  "reservation:rejected",
  "reservation:cancelled",
  "reservation:new",
  "reservation:status-updated",
  "reservationCreated",
  "reservationUpdated",
  "reservationAccepted",
  "reservationRejected",
  "reservationCancelled",
  "newReservation",
  "reservationStatusUpdated",
];

const RESERVATION_EVENTS = (
  import.meta.env.VITE_RESERVATION_SOCKET_EVENTS?.split(",")
    .map((event) => event.trim())
    .filter(Boolean) || DEFAULT_RESERVATION_EVENTS
);

const isReservationEvent = (event) => {
  const normalizedEvent = event.toLowerCase();

  return (
    normalizedEvent.includes("reservation") ||
    normalizedEvent.includes("booking") ||
    normalizedEvent.includes("table")
  );
};

export const useReservationSocket = ({ enabled = true } = {}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const socket = connectSocket();

    if (!socket) {
      return undefined;
    }

    const refreshReservations = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
    };

    const refreshMatchedReservationEvent = (event) => {
      if (isReservationEvent(event)) {
        refreshReservations();
      }
    };

    const logConnectionError = (error) => {
      if (import.meta.env.DEV) {
        console.error("[socket] connect_error", error);
      }
    };

    const logEvent = (event, ...args) => {
      if (import.meta.env.DEV) {
        console.log("[socket] event", event, ...args);
      }

      refreshMatchedReservationEvent(event);
    };

    RESERVATION_EVENTS.forEach((event) => {
      socket.on(event, refreshReservations);
    });
    socket.onAny(logEvent);
    socket.on("connect_error", logConnectionError);

    return () => {
      RESERVATION_EVENTS.forEach((event) => {
        socket.off(event, refreshReservations);
      });
      socket.offAny(logEvent);
      socket.off("connect_error", logConnectionError);
    };
  }, [enabled, queryClient]);
};
