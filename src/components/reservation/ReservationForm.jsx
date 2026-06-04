import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../contexts/LanguageContext";
import { useCreateReservationMutation } from "../../hooks/useReservationQueries";
import { getTodayInputDate } from "../../utils/date";

export default function ReservationForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const createReservationMutation = useCreateReservationMutation({
    onSuccess: () => {
      toast.success(t('reservationSuccess'));
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('reservationFailed'));
    },
  });


  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    reservationDate: "",
    reservationTime: "",
    totalGuest: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const updateField = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({ ...current, [name]: false }));
  };

  const inputClassName = (hasError) =>
    `h-14 w-full rounded-xl border bg-[#faf7f2] px-4 outline-none focus:border-orange-500 ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalGuest") {
      const digitsOnly = value.replace(/\D/g, "");
      updateField("totalGuest", digitsOnly);
      return;
    }

    if (name === "reservationDate" && value && value < getTodayInputDate()) {
      toast.error(t('dateFromToday'));
      updateField("reservationDate", "");
      setErrors((current) => ({ ...current, reservationDate: true }));
      return;
    }

    updateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todayStr = getTodayInputDate();
    const nextErrors = {
      customerName: !formData.customerName.trim(),
      email: !formData.email.trim(),
      phone: !formData.phone.trim(),
      reservationDate: !formData.reservationDate || formData.reservationDate < todayStr,
      reservationTime: !formData.reservationTime,
      totalGuest: !formData.totalGuest || Number(formData.totalGuest) <= 0,
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      toast.error(t('fillReservationFields'));
      return;
    }

    if (!formData.reservationDate || formData.reservationDate < todayStr) {
      toast.error(t('dateFromToday'));
      return;
    }

    const reservationDateTime = `${formData.reservationDate}T${formData.reservationTime}:00`;

    createReservationMutation.mutate({
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      totalGuest: Number(formData.totalGuest),
      reservationDate: reservationDateTime,
      note: formData.note,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        name="customerName"
        placeholder={t('fullName')}
        value={formData.customerName}
        onChange={handleChange}
        className={inputClassName(errors.customerName)}
      />

      <input
        type="email"
        name="email"
        placeholder={t('email')}
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        className={inputClassName(errors.email)}
      />

      <input
        name="phone"
        placeholder={t('phoneNumber')}
        value={formData.phone}
        onChange={handleChange}
        className={inputClassName(errors.phone)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            {t('selectDate')}
          </span>
          <input
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            aria-label={t('selectDate')}
            onChange={handleChange}
            onFocus={(e) => e.target.showPicker?.()}
            min={getTodayInputDate()}
            className={`${inputClassName(errors.reservationDate)} appearance-none text-gray-900`}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            {t('selectTime')}
          </span>
          <input
            type="time"
            name="reservationTime"
            value={formData.reservationTime}
            aria-label={t('selectTime')}
            onChange={handleChange}
            onFocus={(e) => e.target.showPicker?.()}
            className={`${inputClassName(errors.reservationTime)} appearance-none text-gray-900`}
          />
        </label>
      </div>

      <input
        type="text"
        name="totalGuest"
        placeholder={t('numberOfGuests')}
        value={formData.totalGuest}
        onChange={handleChange}
        inputMode="numeric"
        pattern="[0-9]*"
        min={1}
        className={inputClassName(errors.totalGuest)}
      />

      <textarea
        name="note"
        placeholder={t('specialRequest')}
        value={formData.note}
        onChange={handleChange}
        rows={5}
        className="w-full rounded-xl border border-gray-200 bg-[#faf7f2] px-4 py-3 outline-none focus:border-orange-500"
      />

      <button
        type="submit"
        disabled={createReservationMutation.isPending}
        className="h-14 w-full rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition"
      >
        {createReservationMutation.isPending ? t('submitting') : t('reserveNow')}
      </button>
    </form>
  );
}
