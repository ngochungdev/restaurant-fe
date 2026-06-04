import ReservationForm from '../components/reservation/ReservationForm'
import { useLanguage } from '../contexts/LanguageContext'
import { useRestaurantSettings } from '../hooks/useRestaurantSettings'

export default function ReservationPage() {
  const { t } = useLanguage()
  const restaurant = useRestaurantSettings()

  return (
  <div className="min-h-screen bg-[#f7f1e8]">

    {/* HERO */}
    <section className="relative h-100 overflow-hidden">
      <img
        src={restaurant.heroImage}
        alt={restaurant.name}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div>
          <p className="mb-4 text-sm tracking-[6px] uppercase">
            {restaurant.name}
          </p>
          <h1 className="text-5xl font-light md:text-6xl">
            {t('reservationHeader')}
          </h1>
        </div>
      </div>
    </section>

    {/* CONTENT */}
    <section className="px-6 py-20 grid lg:grid-cols-2 gap-14">

      {/* LEFT INFO */}
      <div>
        <p className="text-sm tracking-[5px] uppercase text-orange-600">
          {t('reservationSub')}
        </p>

        <h2 className="mt-4 text-4xl font-light leading-snug">
          {t('reservationTitle')}
        </h2>

        <p className="mt-6 text-gray-600 leading-7">
          {t('reservationDescription')}
        </p>

        <div className="mt-10 space-y-6 border-l border-orange-300 pl-6">
          <div>
            <h3 className="font-semibold">{t('openingHours')}</h3>
            <p className="text-gray-600">{restaurant.openingHours}</p>
          </div>

          <div>
            <h3 className="font-semibold">{t('contact')}</h3>
            <p className="text-gray-600">{restaurant.phone}</p>
          </div>

          <div>
            <h3 className="font-semibold">{t('address')}</h3>
            <p className="text-gray-600">
              {restaurant.fullAddress}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div id="reservation-form" className="scroll-mt-28 bg-white rounded-[30px] p-10 shadow-xl">
        <h2 className="text-2xl font-light text-center mb-8">{t('bookATable')}</h2>

        <ReservationForm />
      </div>

    </section>
  </div>
);
}
