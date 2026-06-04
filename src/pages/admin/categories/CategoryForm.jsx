import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function CategoryForm({
  initialValues = { name: "" },
  submitting = false,
  submitLabel,
  onSubmit,
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setErrors({ name: true });
      toast.error(t("fillCategoryFields"));
      return;
    }

    onSubmit({ name: form.name.trim() });
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">{t("categoryName")}</span>
        <input
          type="text"
          value={form.name}
          onChange={(event) => {
            setForm({ ...form, name: event.target.value });
            setErrors({ name: false });
          }}
          placeholder={t("categoryName")}
          className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white ${
            errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
          }`}
        />
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t("submitting") : submitLabel}
      </button>
    </div>
  );
}
