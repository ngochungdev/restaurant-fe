import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import LoadingState from "../../components/common/LoadingState";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCategoriesQuery } from "../../hooks/useCategoryQueries";
import { useMenusQuery } from "../../hooks/useMenuQueries";
import { useReservationsQuery } from "../../hooks/useReservationQueries";

const getReservationStatus = (reservation) => reservation.status || "PENDING";

const getReservationTime = (reservation) =>
  new Date(reservation.reservationDateLocal || reservation.reservationDate || 0).getTime();

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: menus = [], isLoading: isMenusLoading } = useMenusQuery();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoriesQuery();
  const { data: reservations = [], isLoading: isReservationsLoading } = useReservationsQuery();
  const isLoading = isMenusLoading || isCategoriesLoading || isReservationsLoading;

  const pendingReservations = reservations.filter(
    (reservation) => getReservationStatus(reservation) === "PENDING",
  );
  const latestReservations = [...reservations]
    .sort((a, b) => getReservationTime(b) - getReservationTime(a))
    .slice(0, 5);

  if (isLoading) return <LoadingState label={t("loadingDashboard")} />;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">{t("adminDashboard")}</h2>
          <p className="mt-2 text-sm text-gray-500">{t("dashboardDescription")}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          [t("totalMenuItems"), menus.length],
          [t("totalCategories"), categories.length],
          [t("totalReservations"), reservations.length],
          [t("pendingReservations"), pendingReservations.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900">{t("latestReservations")}</h3>
          </div>

          <div className="p-6">
            {latestReservations.length === 0 ? (
              <EmptyState
                title={t("noReservations")}
                description={t("noReservationsDescription")}
              />
            ) : (
              <div className="space-y-4">
                {latestReservations.map((reservation) => (
                  <div
                    key={reservation.id || reservation._id}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {reservation.customerName || reservation.user?.username}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(
                          reservation.reservationDateLocal || reservation.reservationDate,
                        ).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {t("numberOfGuests")}: {reservation.totalGuest}
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {t(
                        {
                          CONFIRMED: "statusConfirmed",
                          PENDING: "statusPending",
                          CANCELLED: "statusCancelled",
                          ACCEPTED: "statusAccepted",
                          REJECTED: "statusRejected",
                        }[getReservationStatus(reservation)] || "statusPending",
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">{t("quickActions")}</h3>
          <div className="mt-5 grid gap-3">
            <Link
              to="/admin/menu/add"
              className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t("addMenu")}
            </Link>
            <Link
              to="/admin/categories/add"
              className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {t("addCategory")}
            </Link>
            <Link
              to="/admin/reservations"
              className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {t("adminReservations")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
