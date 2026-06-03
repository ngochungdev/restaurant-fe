import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingState from "../../../components/common/LoadingState";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  getCategoryId,
  getCategoryName,
  useCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { showApiError } from "../../../utils/apiError";
import CategoryForm from "./CategoryForm";

export default function CategoryEdit() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const category = categories.find((item) => String(getCategoryId(item)) === String(id));

  const updateCategoryMutation = useUpdateCategoryMutation({
    onSuccess: () => {
      toast.success(t("updateCategorySuccess"));
      navigate(`/admin/categories/${id}`);
    },
    onError: (error) => {
      console.error(error);
      showApiError(error, t("updateCategoryFail"));
    },
  });

  if (isLoading) return <LoadingState label={t("loadingCategories")} />;
  if (!category) return <Navigate to="/admin/categories" replace />;

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <Link to={`/admin/categories/${id}`} className="text-sm font-semibold text-emerald-600">
          {getCategoryName(category)}
        </Link>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">{t("editCategory")}</h2>
      </div>

      <CategoryForm
        key={id}
        initialValues={{ name: getCategoryName(category) }}
        submitLabel={t("saveChanges")}
        submitting={updateCategoryMutation.isPending}
        onSubmit={(payload) => updateCategoryMutation.mutate({ id, payload })}
      />
    </section>
  );
}
