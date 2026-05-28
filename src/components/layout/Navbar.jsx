import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../../stores/auth.store'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/hero.png'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { locale, setLocale, t } = useLanguage()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Bella Restaurant logo" className="h-10 w-10 rounded-full object-cover shadow-sm" />
          <h1 className="text-2xl font-bold">Bella Restaurant</h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/">{t('home')}</Link>
          <Link to="/menu">{t('menu')}</Link>
          <Link to="/about-us">{t('aboutUs')}</Link>
          <Link to="/reservation">{t('reservation')}</Link>

          {
            isAuthenticated && user && user.role === "ADMIN" && (
              <>
                <Link to="/admin/menu">{t('adminMenu')}</Link>
                <Link to="/admin/reservations">{t('adminReservations')}</Link>
              </>
            )
          }

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {t('logout')}
            </button>
          ) : (
            <>
              <Link to="/login">{t('login')}</Link>
            </>
          )}

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
              <Link to="/reservation" onClick={() => setOpen(false)} className="py-2">{t('reservation')}</Link>
              {isAuthenticated && user && user.role === "ADMIN" && (
                <>
                  <Link to="/admin/menu" onClick={() => setOpen(false)} className="py-2">{t('adminMenu')}</Link>
                  <Link to="/admin/reservations" onClick={() => setOpen(false)} className="py-2">{t('adminReservations')}</Link>
                </>
              )}

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

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-white"
                >
                  {t('logout')}
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="py-2">{t('login')}</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="py-2">{t('register')}</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}