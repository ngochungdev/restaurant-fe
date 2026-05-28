import { useEffect, useState } from "react";
import reservationService from "../../services/reservationService";
import useAuthStore from "../../stores/auth.store";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user && user.role === "ADMIN";
  const { t } = useLanguage();

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getAll();
      // axios returns response; if using api.get might return response.data
      const data = res.data || res;
      setReservations(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error(err);
      toast.error(t("reservationFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleAccept = async (id) => {
    try {
      await reservationService.acceptReservation(id);
      toast.success(t("reservationAccepted"));
      fetch();
    } catch (err) {
      console.error(err);
      toast.error(t("acceptFailed"));
    }
  };

  const handleReject = async (id) => {
    try {
      await reservationService.rejectReservation(id);
      toast.success(t("reservationRejected"));
      fetch();
    } catch (err) {
      console.error(err);
      toast.error(t("rejectFailed"));
    }
  };

  if (loading) return <div>{t("submitting")}</div>;

  return (
    <div className="space-y-4">
      {reservations.length === 0 && <div>{t("noReservations")}</div>}

      {reservations.map((r) => (
        <div key={r.id || r._id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-medium">
                {r.customerName || r.user?.username}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(
                  r.reservationDateLocal || r.reservationDate,
                ).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {t("phoneNumber")}: {r.phone}
              </div>
              <div className="text-sm text-gray-600">
                {t("numberOfGuests")}: {r.totalGuest}
              </div>
              {r.specialRequest && (
                <div className="mt-2 text-sm text-gray-700">
                  {t("specialRequest")}: {r.specialRequest}
                </div>
              )}
            </div>

            <div className="text-right flex-shrink-0">
              <div
                className={`inline-block rounded-full px-3 py-1 text-sm ${r.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : r.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
              >
                {t(
                  {
                    CONFIRMED: "statusConfirmed",
                    PENDING: "statusPending",
                    CANCELLED: "statusCancelled",
                    ACCEPTED: "statusAccepted",
                    REJECTED: "statusRejected",
                  }[r.status] || "statusPending",
                )}
              </div>

              {isAdmin && (r.status === "PENDING" || !r.status) && (
                <div className="mt-3 flex gap-2 justify-end">
                  <button
                    onClick={() => handleAccept(r.id || r._id)}
                    className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white"
                  >
                    {t("accept")}
                  </button>

                  <button
                    onClick={() => handleReject(r.id || r._id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white"
                  >
                    {t("reject")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
