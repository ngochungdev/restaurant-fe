import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ImagePreview from "../../../components/common/ImagePreview";
import LoadingState from "../../../components/common/LoadingState";
import { useLanguage } from "../../../contexts/LanguageContext";
import { restaurantConfig } from "../../../config/restaurant";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "../../../hooks/useRestaurantSettings";
import { showApiError } from "../../../utils/apiError";

const getInitialForm = (settings) => ({
  restaurantName: settings?.restaurantName || restaurantConfig.name || "",
  hotline: settings?.hotline || restaurantConfig.phone || "",
  address: settings?.address || restaurantConfig.address || "",
  fullAddress: settings?.fullAddress || restaurantConfig.fullAddress || "",
  openingHours: settings?.openingHours || restaurantConfig.openingHours || "",
  logo: settings?.logo || "",
  heroImage: settings?.heroImage || restaurantConfig.heroImage || "",
  facebook: settings?.facebook || "",
  instagram: settings?.instagram || "",
  zalo: settings?.zalo || "",
  brandColor: settings?.brandColor || "",
});

const trimPayload = (form) =>
  Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, value.trim()]),
  );

export default function SettingsPage() {
  const { t } = useLanguage();
  const { data: settings, isLoading, isError } = useSettingsQuery();
  const [form, setForm] = useState(() => getInitialForm(settings));
  const updateSettingsMutation = useUpdateSettingsMutation({
    onSuccess: () => toast.success(t("updateSettingsSuccess")),
    onError: (error) => {
      console.error(error);
      showApiError(error, t("updateSettingsFail"));
    },
  });

  const initialForm = useMemo(() => getInitialForm(settings), [settings]);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.restaurantName.trim()) {
      toast.error(t("fillRestaurantName"));
      return;
    }

    updateSettingsMutation.mutate(trimPayload(form));
  };

  if (isLoading) return <LoadingState label={t("loadingSettings")} />;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{t("adminSettings")}</h2>
        <p className="mt-2 text-sm text-gray-500">{t("settingsDescription")}</p>
        {isError && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {t("settingsFallbackNotice")}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">{t("restaurantInformation")}</h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("restaurantName")}</span>
              <input
                type="text"
                value={form.restaurantName}
                onChange={(event) => updateField("restaurantName", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("phoneNumber")}</span>
              <input
                type="text"
                value={form.hotline}
                onChange={(event) => updateField("hotline", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("address")}</span>
              <input
                type="text"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("openingHours")}</span>
              <input
                type="text"
                value={form.openingHours}
                onChange={(event) => updateField("openingHours", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">{t("fullAddress")}</span>
              <input
                type="text"
                value={form.fullAddress}
                onChange={(event) => updateField("fullAddress", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">{t("brandAssets")}</h3>

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("logoUrl")}</span>
              <input
                type="text"
                value={form.logo}
                onChange={(event) => updateField("logo", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
              <ImagePreview
                src={form.logo}
                alt={t("logoPreview")}
                type="logo"
                className="mt-3 inline-block"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("heroImageUrl")}</span>
              <input
                type="text"
                value={form.heroImage}
                onChange={(event) => updateField("heroImage", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
              <ImagePreview
                src={form.heroImage}
                alt={t("heroImagePreview")}
                type="hero"
                className="mt-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t("brandColor")}</span>
              <input
                type="text"
                value={form.brandColor}
                onChange={(event) => updateField("brandColor", event.target.value)}
                placeholder="#16a34a"
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">{t("socialLinks")}</h3>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["facebook", "Facebook"],
              ["instagram", "Instagram"],
              ["zalo", "Zalo"],
            ].map(([name, label]) => (
              <label key={name} className="block">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <input
                  type="text"
                  value={form[name]}
                  onChange={(event) => updateField(name, event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateSettingsMutation.isPending ? t("submitting") : t("saveSettings")}
          </button>
        </div>
      </form>
    </section>
  );
}
