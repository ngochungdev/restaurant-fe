import { useLanguage } from '../contexts/LanguageContext'

export default function AboutUsPage() {
  const { t } = useLanguage()

  return (
    <section className="bg-gray-100 px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop"
          alt="chef"
          className="rounded-3xl shadow-xl"
        />

        <div>
          <p className="font-semibold uppercase tracking-widest text-orange-500">
            {t('aboutUs')}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {t('aboutHeadline')}
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('aboutText')}
          </p>
        </div>
      </div>
    </section>
  )
}