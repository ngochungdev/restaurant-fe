import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "../lib/queryClient";
import { connectSocket } from "../services/socket";
import { useLanguage } from "../contexts/LanguageContext";

const getReservationDescription = (reservation, t) => {
  const parts = [
    reservation?.customerName,
    reservation?.phone,
    reservation?.totalGuest ? `${reservation.totalGuest} ${t("guestCountShort")}` : undefined,
  ];

  return parts.filter(Boolean).join(" - ");
};

const getNotificationDescription = (notification, t) => {
  if (notification?.type === "reservation") {
    const description = getReservationDescription(notification.reservation || {}, t);

    return description || notification.message;
  }

  if (notification?.type === "lead") {
    const lead = notification.lead || {};
    const parts = [lead.restaurantName, lead.contactName, lead.phone];

    return parts.filter(Boolean).join(" - ") || notification.message;
  }

  return notification?.message;
};

export const useAdminNotifications = ({ enabled = true } = {}) => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const socket = connectSocket();

    if (!socket) {
      return undefined;
    }

    const shownReservationNotifications = new Set();
    let lastReservationToastAt = 0;

    const markReservationShown = (reservation) => {
      const key = reservation?.id || reservation?._id;
      if (!key) return false;

      if (shownReservationNotifications.has(key)) return true;

      shownReservationNotifications.add(key);
      window.setTimeout(() => {
        shownReservationNotifications.delete(key);
      }, 5000);

      return false;
    };

    const showReservationToast = (reservation) => {
      if (markReservationShown(reservation)) return;

      lastReservationToastAt = Date.now();
      toast.info(t("newReservationNotification"), {
        description:
          getReservationDescription(reservation, t) ||
          t("newReservationNotificationDescription"),
      });
    };

    const handleNotification = (notification) => {
      if (notification?.type === "reservation") {
        queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
        showReservationToast(notification.reservation || {});
        return;
      }

      if (notification?.type === "lead") {
        queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      }

      toast.info(notification?.title || "New notification", {
        description: getNotificationDescription(notification, t),
      });
    };

    const handleReservationsUpdated = (payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });

      if (payload?.action === "created") {
        showReservationToast(payload.reservation || {});
      }
    };

    const handleReservationCreated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
      if (Date.now() - lastReservationToastAt < 2000) return;

      showReservationToast({});
    };

    const handleLeadCreated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
    };

    socket.on("notifications:new", handleNotification);
    socket.on("reservations:updated", handleReservationsUpdated);
    socket.on("reservation:created", handleReservationCreated);
    socket.on("leads:created", handleLeadCreated);

    return () => {
      socket.off("notifications:new", handleNotification);
      socket.off("reservations:updated", handleReservationsUpdated);
      socket.off("reservation:created", handleReservationCreated);
      socket.off("leads:created", handleLeadCreated);
    };
  }, [enabled, queryClient, t]);
};
