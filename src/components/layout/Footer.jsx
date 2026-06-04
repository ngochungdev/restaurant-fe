import { useLanguage } from '../../contexts/LanguageContext'
import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'
import { getExternalHref } from '../../utils/externalLink'

export default function Footer() {
  const { t } = useLanguage()
  const restaurant = useRestaurantSettings()
  const socialLinks = [
    ['Facebook', 'F', getExternalHref(restaurant.facebook, 'facebook')],
    ['Zalo', 'Z', getExternalHref(restaurant.zalo, 'zalo')],
    ['Instagram', 'IG', getExternalHref(restaurant.instagram, 'instagram')],
  ].filter(([, , href]) => href)

  return (
    <footer className="bg-black px-6 py-12 text-white">
      <div className="w-full">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {restaurant.name}
            </h2>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {socialLinks.map(([label, shortLabel, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-gray-300 transition hover:border-white/40 hover:bg-white hover:text-black"
                  >
                    {shortLabel}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              {t('openingHours')}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {restaurant.openingHours}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              {t('contact')}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {restaurant.phone}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              {t('address')}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {restaurant.fullAddress || restaurant.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
