import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCreateLeadMutation } from "../../hooks/useLeadQueries";

const initialFormData = {
  restaurantName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  message: "",
};

export default function LeadForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialFormData);
  const createLeadMutation = useCreateLeadMutation({
    onSuccess: () => {
      toast.success(t("leadSuccess"));
      setFormData(initialFormData);
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("leadFailed"));
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createLeadMutation.mutate({
      ...formData,
      source: "homepage-demo-request",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        name="restaurantName"
        value={formData.restaurantName}
        onChange={handleChange}
        placeholder={t("restaurantName")}
        required
        className="h-12 rounded-lg border border-stone-200 bg-white px-4 text-stone-900 outline-none focus:border-orange-500"
      />
      <input
        name="contactName"
        value={formData.contactName}
        onChange={handleChange}
        placeholder={t("contactName")}
        required
        className="h-12 rounded-lg border border-stone-200 bg-white px-4 text-stone-900 outline-none focus:border-orange-500"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("email")}
          autoComplete="email"
          className="h-12 rounded-lg border border-stone-200 bg-white px-4 text-stone-900 outline-none focus:border-orange-500"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t("phoneNumber")}
          required
          className="h-12 rounded-lg border border-stone-200 bg-white px-4 text-stone-900 outline-none focus:border-orange-500"
        />
      </div>
      <input
        type="url"
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder={t("websiteUrl")}
        className="h-12 rounded-lg border border-stone-200 bg-white px-4 text-stone-900 outline-none focus:border-orange-500"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder={t("leadMessage")}
        rows={4}
        className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none focus:border-orange-500"
      />
      <button
        type="submit"
        disabled={createLeadMutation.isPending}
        className="h-12 rounded-lg bg-orange-600 px-5 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
      >
        {createLeadMutation.isPending ? t("submitting") : t("sendDemoRequest")}
      </button>
    </form>
  );
}
