import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()
  const restaurant = useRestaurantSettings()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="h-10 w-10 rounded-full object-cover shadow-sm" />
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/">{t('home')}</Link>
          <Link to="/menu">{t('menu')}</Link>
          <Link to="/about-us">{t('aboutUs')}</Link>
          <Link to="/reservation#reservation-form">{t('reservation')}</Link>
          <Link
            to="/#demo-request"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {t('requestDemo')}
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('vi')}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === 'vi' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-white'}`}
            >
              VI
            </button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            {!open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden absolute inset-x-0 top-full z-40 bg-white border-t shadow">
            <div className="flex flex-col gap-2 px-4 py-4">
              <Link to="/" onClick={() => setOpen(false)} className="py-2">{t('home')}</Link>
              <Link to="/menu" onClick={() => setOpen(false)} className="py-2">{t('menu')}</Link>
              <Link to="/about-us" onClick={() => setOpen(false)} className="py-2">{t('aboutUs')}</Link>
              <Link to="/reservation#reservation-form" onClick={() => setOpen(false)} className="py-2">{t('reservation')}</Link>
              <Link
                to="/#demo-request"
                onClick={() => setOpen(false)}
                className="rounded-full bg-orange-500 px-4 py-3 text-center font-semibold text-white"
              >
                {t('requestDemo')}
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocale('en')
                    setOpen(false)
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-white'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocale('vi')
                    setOpen(false)
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === 'vi' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-white'}`}
                >
                  VI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
