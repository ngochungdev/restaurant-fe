import { useMemo, useState } from "react";
import useAuthStore from "../../../stores/auth.store";
import { toast } from "sonner";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import EmptyState from "../../../components/common/EmptyState";
import LoadingState from "../../../components/common/LoadingState";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  useAcceptReservationMutation,
  useRejectReservationMutation,
  useReservationsQuery,
} from "../../../hooks/useReservationQueries";
import { useReservationSocket } from "../../../hooks/useReservationSocket";

const getReservationStatus = (reservation) => reservation.status || "PENDING";

const getReservationDate = (reservation) => {
  const value = reservation.reservationDateLocal || reservation.reservationDate;
  if (!value) return "";
  if (typeof value === "string" && value.includes("T")) return value.split("T")[0];

  return new Date(value).toISOString().split("T")[0];
};

export default function ReservationsList() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user && user.role === "ADMIN";
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [reservationToReject, setReservationToReject] = useState(null);

  useReservationSocket({ enabled: isAdmin });

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
    onSuccess: () => {
      toast.success(t("reservationRejected"));
      setReservationToReject(null);
    },
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

  const confirmReject = () => {
    const id = reservationToReject?.id || reservationToReject?._id;
    if (!id) return;

    handleReject(id);
  };

  const summary = useMemo(() => {
    const counts = {
      total: reservations.length,
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    reservations.forEach((reservation) => {
      const status = getReservationStatus(reservation);
      if (status === "ACCEPTED" || status === "CONFIRMED") counts.accepted += 1;
      if (status === "REJECTED" || status === "CANCELLED") counts.rejected += 1;
      if (status === "PENDING") counts.pending += 1;
    });

    return counts;
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const status = getReservationStatus(reservation);
      const statusGroup =
        status === "CONFIRMED" ? "ACCEPTED" : status === "CANCELLED" ? "REJECTED" : status;
      const customerName = reservation.customerName || reservation.user?.username || "";
      const searchableText = `${customerName} ${reservation.phone || ""} ${reservation.email || ""}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStatus = statusFilter === "ALL" || statusGroup === statusFilter;
      const matchesDate = !dateFilter || getReservationDate(reservation) === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [dateFilter, reservations, searchTerm, statusFilter]);

  if (loading) return <LoadingState label={t("loadingReservations")} />;
  if (isError) return <section className="px-6 py-10">{t("reservationFailed")}</section>;

  return (
    <section className="px-6 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{t("adminReservations")}</h2>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          [t("totalReservations"), summary.total],
          [t("statusPending"), summary.pending],
          [t("statusAccepted"), summary.accepted],
          [t("statusRejected"), summary.rejected],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <label className="block">
          <span className="sr-only">{t("searchReservations")}</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("searchReservationsPlaceholder")}
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="sr-only">{t("filterReservationStatus")}</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white md:w-52"
          >
            <option value="ALL">{t("allStatuses")}</option>
            <option value="PENDING">{t("statusPending")}</option>
            <option value="ACCEPTED">{t("statusAccepted")}</option>
            <option value="REJECTED">{t("statusRejected")}</option>
          </select>
        </label>

        <label className="block">
          <span className="sr-only">{t("filterReservationDate")}</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            onFocus={(event) => event.target.showPicker?.()}
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white md:w-48"
          />
        </label>
      </div>

      <div className="space-y-4">
        {filteredReservations.length === 0 && (
          <EmptyState
            title={reservations.length === 0 ? t("noReservations") : t("noReservationMatches")}
            description={reservations.length === 0 ? t("noReservationsDescription") : t("tryDifferentReservationFilter")}
          />
        )}

        {filteredReservations.map((r) => (
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
                      onClick={() => setReservationToReject(r)}
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

      <ConfirmDialog
        isOpen={!!reservationToReject}
        title={t("reject")}
        description={t("confirmRejectReservation")}
        cancelLabel={t("cancel")}
        confirmLabel={rejectReservationMutation.isPending ? t("submitting") : t("reject")}
        isPending={rejectReservationMutation.isPending}
        onClose={() => setReservationToReject(null)}
        onConfirm={confirmReject}
      />
    </section>
  );
}
