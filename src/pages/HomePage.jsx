import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { restaurantConfig } from '../config/restaurant'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <section className="relative h-[90vh] overflow-hidden">
      <img
        src={restaurantConfig.heroImage}
        alt={restaurantConfig.name}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="max-w-4xl text-6xl font-bold">
          {t('experienceDining')}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-200">
          {t('experienceText')}
        </p>

        <Link
          to="/reservation"
          className="mt-8 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-semibold"
        >
          {t('bookTable')}
        </Link>
      </div>
    </section>
  )
}
