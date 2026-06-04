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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalGuest") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        totalGuest: digitsOnly,
      });
      return;
    }

    if (name === "reservationDate" && value && value < getTodayInputDate()) {
      toast.error(t('dateFromToday'));
      setFormData({
        ...formData,
        reservationDate: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todayStr = getTodayInputDate();
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
        className="h-14 w-full rounded-xl border border-gray-200 bg-[#faf7f2] px-4 outline-none focus:border-orange-500"
      />

      <input
        type="email"
        name="email"
        placeholder={t('email')}
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        className="h-14 w-full rounded-xl border border-gray-200 bg-[#faf7f2] px-4 outline-none focus:border-orange-500"
      />

      <input
        name="phone"
        placeholder={t('phoneNumber')}
        value={formData.phone}
        onChange={handleChange}
        className="h-14 w-full rounded-xl border border-gray-200 bg-[#faf7f2] px-4 outline-none focus:border-orange-500"
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
            className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-[#faf7f2] px-4 text-gray-900 outline-none focus:border-orange-500"
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
            className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-[#faf7f2] px-4 text-gray-900 outline-none focus:border-orange-500"
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
        className="h-14 w-full rounded-xl border border-gray-200 bg-[#faf7f2] px-4 outline-none focus:border-orange-500"
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
