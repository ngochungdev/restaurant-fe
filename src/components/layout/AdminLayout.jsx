import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../stores/auth.store";
import { useLanguage } from "../../contexts/LanguageContext";
import { restaurantConfig } from "../../config/restaurant";
import { authService } from "../../services/auth.service";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const user = useAuthStore((state) => state.user);
  const { locale, setLocale, t } = useLanguage();

  useAdminNotifications({ enabled: user?.role === "ADMIN" });

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error(error);
      }
    }

    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img src={restaurantConfig.logo} alt={`${restaurantConfig.name} logo`} className="h-10 w-10 rounded-full object-cover shadow-sm" />
            <h1 className="text-2xl font-bold">Admin</h1>
          </Link>

          <nav className="hidden items-center gap-6 font-medium md:flex">
            <Link to="/admin/dashboard">{t("adminDashboard")}</Link>
            <Link to="/admin/menu">{t("adminMenu")}</Link>
            <Link to="/admin/categories">{t("adminCategories")}</Link>
            <Link to="/admin/reservations">{t("adminReservations")}</Link>
            <Link to="/admin/settings">{t("adminSettings")}</Link>
            {/* <Link to="/">{t("home")}</Link> */}

            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "en" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-white"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("vi")}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "vi" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-white"}`}
              >
                VI
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {t("logout")}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {!open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>

          {open && (
            <div className="absolute inset-x-0 top-full z-40 border-t bg-white shadow md:hidden">
              <div className="flex flex-col gap-2 px-4 py-4">
                <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="py-2">{t("adminDashboard")}</Link>
                <Link to="/admin/menu" onClick={() => setOpen(false)} className="py-2">{t("adminMenu")}</Link>
                <Link to="/admin/categories" onClick={() => setOpen(false)} className="py-2">{t("adminCategories")}</Link>
                <Link to="/admin/reservations" onClick={() => setOpen(false)} className="py-2">{t("adminReservations")}</Link>
                <Link to="/admin/settings" onClick={() => setOpen(false)} className="py-2">{t("adminSettings")}</Link>
                <Link to="/" onClick={() => setOpen(false)} className="py-2">{t("home")}</Link>

                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("en");
                      setOpen(false);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "en" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-white"}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("vi");
                      setOpen(false);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "vi" ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-white"}`}
                  >
                    VI
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-white"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="bg-gray-50">
        <Outlet />
      </main>
    </>
  );
}
