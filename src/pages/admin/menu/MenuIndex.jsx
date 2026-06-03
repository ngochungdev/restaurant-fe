import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../../../components/common/EmptyState";
import LoadingState from "../../../components/common/LoadingState";
import MenuCard from "../../../components/menu/MenuCard";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getMenuId, useMenusQuery } from "../../../hooks/useMenuQueries";

export default function MenuIndex() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: menus = [], isLoading } = useMenusQuery();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">{t("adminMenu")}</h2>
          <p className="mt-2 text-sm text-gray-500">{t("addMenuDescription")}</p>
        </div>

        <Link
          to="/admin/menu/add"
          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {t("addMenu")}
        </Link>
      </div>

      {isLoading ? (
        <LoadingState label={t("loadingMenu")} />
      ) : menus.length === 0 ? (
        <EmptyState
          title={t("noMenuItems")}
          description={t("addFirstMenuItem")}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((item) => (
            <MenuCard
              key={getMenuId(item)}
              item={item}
              onClick={() => navigate(`/admin/menu/${getMenuId(item)}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
