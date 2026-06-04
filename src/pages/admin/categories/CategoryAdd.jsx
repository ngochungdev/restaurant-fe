import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaArrowLeft } from "react-icons/fa";

import { useLanguage } from "../../../contexts/LanguageContext";
import { getCategoryId, useCreateCategoryMutation } from "../../../hooks/useCategoryQueries";
import { showApiError } from "../../../utils/apiError";
import CategoryForm from "./CategoryForm";

export default function CategoryAdd() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (data) => {
      toast.success(t("createCategorySuccess"));
      const category = data?.data || data?.item || data;
      const id = getCategoryId(category);
      navigate(id ? `/admin/categories/${id}` : "/admin/categories");
    },
    onError: (error) => {
      console.error(error);
      showApiError(error, t("createCategoryFail"));
    },
  });

  return (
    <section className="px-6 py-10">
      <div className="mb-8">
        <Link to="/admin/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <FaArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          {t("categoryList")}
        </Link>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">{t("addCategory")}</h2>
      </div>

      <CategoryForm
        submitLabel={t("createCategory")}
        submitting={createCategoryMutation.isPending}
        onSubmit={(payload) => createCategoryMutation.mutate(payload)}
      />
    </section>
  );
}
