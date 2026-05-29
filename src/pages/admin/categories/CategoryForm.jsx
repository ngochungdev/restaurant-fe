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

  const handleSubmit = () => {
    if (!form.name.trim()) {
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
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder={t("categoryName")}
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
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
