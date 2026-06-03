import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getCategoryId, getCategoryName, useCategoriesQuery } from "../../../hooks/useCategoryQueries";
import { formatPriceInput, getRawPriceValue } from "../../../utils/price";

const emptyForm = {
  name: "",
  price: "",
  category_id: "",
  description: "",
};

export default function MenuForm({
  initialValues = emptyForm,
  initialImage = "",
  requireImage = false,
  submitting = false,
  submitLabel,
  onSubmit,
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    ...initialValues,
    price: formatPriceInput(initialValues.price),
  });
  const [imageData, setImageData] = useState("");
  const [preview, setPreview] = useState(initialImage);
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategoriesQuery();

  useEffect(() => {
    if (isCategoriesError) {
      toast.error(t("loadCategoriesFail"));
    }
  }, [isCategoriesError, t]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result || "");
      setPreview(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.category_id || !form.description || (requireImage && !imageData)) {
      toast.error(requireImage ? t("fillAllFields") : t("fillMenuFields"));
      return;
    }

    onSubmit({
      ...form,
      price: getRawPriceValue(form.price),
      image: imageData || initialImage,
    });
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("menuName")}</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder={t("menuName")}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("price")}</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: formatPriceInput(event.target.value) })}
            placeholder={t("price")}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-700">{t("category")}</span>
            <Link
              to="/admin/categories/add"
              aria-label={t("addCategory")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xl font-semibold leading-none text-white transition hover:bg-emerald-700"
            >
              +
            </Link>
          </div>
          <select
            value={form.category_id}
            onChange={(event) => setForm({ ...form, category_id: event.target.value })}
            disabled={isCategoriesLoading}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          >
            <option value="">
              {isCategoriesLoading ? t("loadingCategories") : t("selectCategory")}
            </option>
            {categories.map((category) => (
              <option key={getCategoryId(category)} value={getCategoryId(category)}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
          {isCategoriesLoading && (
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-500">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600"
              />
              {t("loadingCategories")}
            </div>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("description")}</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder={t("description")}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("image")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label={t("uploadImage")}
            className="mt-2 w-full text-sm text-gray-700 file:rounded-xl file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
          />
        </label>

        {preview && (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">{t("previewImage")}</p>
            <img
              src={preview}
              alt="Preview"
              className="max-h-56 w-full rounded-3xl object-contain"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t("submitting") : submitLabel}
        </button>
      </div>
    </div>
  );
}
