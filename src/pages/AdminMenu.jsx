import { useEffect, useState } from "react";
import { toast } from "sonner";
import menuService from "../services/menu.service";
import { useLanguage } from "../contexts/LanguageContext";

export default function AdminMenu() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageData, setImageData] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!imageFile) {
      setPreview(null);
      setImageData("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result || "");
      setPreview(reader.result || null);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.category || !form.description || !imageData) {
      toast.error(t('fillAllFields'));
      return;
    }

    const payload = {
      ...form,
      image: imageData,
    };

    try {
      setLoading(true);
      await menuService.create(payload);
      toast.success(t('createMenuSuccess'));
      setForm({ name: "", price: "", category: "", description: "" });
      setImageFile(null);
      setImageData("");
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data;
      if (detail) {
        const errors = detail.errors || detail.message || detail;
        if (Array.isArray(errors)) {
          errors.forEach((msg) => toast.error(msg));
        } else if (typeof errors === "object") {
          Object.values(errors).flat().forEach((msg) => {
            if (typeof msg === "string") toast.error(msg);
          });
        } else {
          toast.error(String(errors));
        }
      } else {
        toast.error(t('createMenuFail'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{t('addMenu')}</h2>
        <p className="mt-2 text-sm text-gray-500">
          {t('addMenuDescription')}
        </p>
      </div>

      <div className="grid gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t('menuName')}</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('menuName')}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t('price')}</span>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder={t('price')}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t('category')}</span>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder={t('category')}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t('description')}</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t('description')}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{t('image')}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label={t('uploadImage')}
            className="mt-2 w-full text-sm text-gray-700 file:rounded-xl file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
          />
        </label>

        {preview && (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">{t('previewImage')}</p>
            <img
              src={preview}
              alt="Preview"
              className="h-56 w-full rounded-3xl object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t('submitting') : t('createMenu')}
        </button>
      </div>
    </div>
  );
}
