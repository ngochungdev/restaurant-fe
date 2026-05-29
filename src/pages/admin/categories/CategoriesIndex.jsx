import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getCategoryId, getCategoryName, useCategoriesQuery } from "../../../hooks/useCategoryQueries";

export default function CategoriesIndex() {
  const { t } = useLanguage();
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategoriesQuery();

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">{t("adminCategories")}</h2>
          <p className="mt-2 text-sm text-gray-500">{t("adminCategoriesDescription")}</p>
        </div>

        <Link
          to="/admin/categories/add"
          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {t("addCategory")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">{t("categoryList")}</h3>
        </div>

        {isLoading ? (
          <p className="p-6 text-sm text-gray-500">{t("loadingCategories")}</p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-600">{t("loadCategoriesFail")}</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">{t("noCategories")}</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <Link
                key={getCategoryId(category)}
                to={`/admin/categories/${getCategoryId(category)}`}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">{getCategoryName(category)}</p>
                  <p className="mt-1 text-xs text-gray-500">ID: {getCategoryId(category)}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{t("detail")}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
