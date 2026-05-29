import useAuthStore from "../../../stores/auth.store";
import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  useAcceptReservationMutation,
  useRejectReservationMutation,
  useReservationsQuery,
} from "../../../hooks/useReservationQueries";

export default function ReservationsList() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user && user.role === "ADMIN";
  const { t } = useLanguage();
  const {
    data: reservations = [],
    isLoading: loading,
    isError,
  } = useReservationsQuery({
    onError: (err) => {
      console.error(err);
      toast.error(t("reservationFailed"));
    },
  });

  const acceptReservationMutation = useAcceptReservationMutation({
    onSuccess: () => toast.success(t("reservationAccepted")),
    onError: (err) => {
      console.error(err);
      toast.error(t("acceptFailed"));
    },
  });

  const rejectReservationMutation = useRejectReservationMutation({
    onSuccess: () => toast.success(t("reservationRejected")),
    onError: (err) => {
      console.error(err);
      toast.error(t("rejectFailed"));
    },
  });

  const handleAccept = async (id) => {
    acceptReservationMutation.mutate(id);
  };

  const handleReject = async (id) => {
    rejectReservationMutation.mutate(id);
  };

  if (loading) return <section className="px-6 py-10">{t("submitting")}</section>;
  if (isError) return <section className="px-6 py-10">{t("reservationFailed")}</section>;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{t("adminReservations")}</h2>
      </div>

      <div className="space-y-4">
        {reservations.length === 0 && <div>{t("noReservations")}</div>}

        {reservations.map((r) => (
          <div key={r.id || r._id} className="rounded-lg border bg-white p-4 shadow-sm">
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
                {r.email && (
                  <div className="text-sm text-gray-600">
                    {t("email")}: {r.email}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  {t("numberOfGuests")}: {r.totalGuest}
                </div>
                {r.specialRequest && (
                  <div className="mt-2 text-sm text-gray-700">
                    {t("specialRequest")}: {r.specialRequest}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 text-right">
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
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleAccept(r.id || r._id)}
                      className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white"
                    >
                      {t("accept")}
                    </button>

                    <button
                      type="button"
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
    </section>
  );
}
