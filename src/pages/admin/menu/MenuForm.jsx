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
  const [errors, setErrors] = useState({});
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

    setErrors((current) => ({ ...current, image: false }));

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result || "");
      setPreview(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const nextErrors = {
      name: !form.name.trim(),
      price: !form.price,
      category_id: !form.category_id,
      description: !form.description.trim(),
      image: requireImage && !imageData,
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      toast.error(requireImage ? t("fillAllFields") : t("fillMenuFields"));
      return;
    }

    onSubmit({
      ...form,
      price: getRawPriceValue(form.price),
      image: imageData || initialImage,
    });
  };

  const updateFormField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: false }));
  };

  const fieldClassName = (hasError) =>
    `mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white ${
      hasError
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-gray-50"
    }`;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("menuName")}</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateFormField("name", event.target.value)}
            placeholder={t("menuName")}
            className={fieldClassName(errors.name)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("price")}</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.price}
            onChange={(event) => updateFormField("price", formatPriceInput(event.target.value))}
            placeholder={t("price")}
            className={fieldClassName(errors.price)}
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
            onChange={(event) => updateFormField("category_id", event.target.value)}
            disabled={isCategoriesLoading}
            className={fieldClassName(errors.category_id)}
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
            onChange={(event) => updateFormField("description", event.target.value)}
            placeholder={t("description")}
            rows={4}
            className={fieldClassName(errors.description)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t("image")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label={t("uploadImage")}
            className={`mt-2 w-full rounded-2xl border p-3 text-sm text-gray-700 file:rounded-xl file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100 ${
              errors.image ? "border-red-400 bg-red-50" : "border-transparent"
            }`}
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
