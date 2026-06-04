import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingState from "../../../components/common/LoadingState";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getMenuId, useDeleteMenuMutation, useMenusQuery } from "../../../hooks/useMenuQueries";
import { showApiError } from "../../../utils/apiError";
import { getMenuCategoryLabel } from "../../../utils/category";
import { formatPrice } from "../../../utils/price";

export default function MenuDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: menus = [], isLoading } = useMenusQuery();
  const menu = menus.find((item) => String(getMenuId(item)) === String(id));

  const deleteMenuMutation = useDeleteMenuMutation({
    onSuccess: () => {
      toast.success(t("deleteMenuSuccess"));
      navigate("/admin/menu");
    },
    onError: (error) => {
      console.error(error);
      showApiError(error, t("deleteMenuFail"));
    },
  });

  const handleDelete = () => {
    if (!menu || !window.confirm(t("confirmDeleteMenu"))) return;
    deleteMenuMutation.mutate(getMenuId(menu));
  };

  if (isLoading) return <LoadingState label={t("loadingMenu")} />;
  if (!menu) return <Navigate to="/admin/menu" replace />;

  const categoryLabel = getMenuCategoryLabel(menu);

  return (
    <section className="px-6 py-10">
      <div className="mb-8">
        <Link to="/admin/menu" className="text-sm font-semibold text-emerald-600">
          {t("adminMenu")}
        </Link>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">{menu.name}</h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <img
          src={menu.image}
          alt={menu.name}
          className="max-h-[60vh] w-full bg-gray-50 object-contain"
        />

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {categoryLabel && (
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                  {categoryLabel}
                </p>
              )}
              <p className="mt-3 text-gray-600">{menu.description}</p>
            </div>
            <span className="text-2xl font-bold text-orange-500">${formatPrice(menu.price)}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/admin/menu/${getMenuId(menu)}/edit`}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t("editMenu")}
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMenuMutation.isPending}
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteMenuMutation.isPending ? t("submitting") : t("deleteMenu")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
