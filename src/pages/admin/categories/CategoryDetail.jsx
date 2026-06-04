import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";
import LoadingState from "../../../components/common/LoadingState";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  getCategoryId,
  getCategoryName,
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { showApiError } from "../../../utils/apiError";

export default function CategoryDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const category = categories.find((item) => String(getCategoryId(item)) === String(id));

  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      toast.success(t("deleteCategorySuccess"));
      navigate("/admin/categories");
    },
    onError: (error) => {
      console.error(error);
      showApiError(error, t("deleteCategoryFail"));
    },
  });

  const handleDelete = () => {
    if (!category || !window.confirm(t("confirmDeleteCategory"))) return;
    deleteCategoryMutation.mutate(getCategoryId(category));
  };

  if (isLoading) return <LoadingState label={t("loadingCategories")} />;
  if (!category) return <Navigate to="/admin/categories" replace />;

  return (
    <section className="px-6 py-10">
      <div className="mb-8">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600"
        >
          <FaArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          {t("categoryList")}
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">{t("categoryName")}</p>
        <p className="mt-1 text-xl font-semibold text-gray-900">{getCategoryName(category)}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/admin/categories/${getCategoryId(category)}/edit`}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {t("editCategory")}
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteCategoryMutation.isPending ? t("submitting") : t("delete")}
          </button>
        </div>
      </div>
    </section>
  );
}
