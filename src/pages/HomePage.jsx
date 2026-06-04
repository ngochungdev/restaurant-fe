import { Link } from 'react-router-dom'
import LeadForm from '../components/lead/LeadForm'
import { useLanguage } from '../contexts/LanguageContext'
import { useRestaurantSettings } from '../hooks/useRestaurantSettings'

const ownerFeatures = [
  'ownerFeatureMenu',
  'ownerFeatureBooking',
  'ownerFeatureAdmin',
  'ownerFeatureBilingual',
]

const businessBenefits = [
  'businessBenefitMobile',
  'businessBenefitMessages',
  'businessBenefitBooking',
]

const pricingPlans = [
  {
    name: 'starterPlan',
    description: 'starterPlanDescription',
    features: ['starterPlanFeatureMenu', 'starterPlanFeatureBranding'],
  },
  {
    name: 'growthPlan',
    description: 'growthPlanDescription',
    features: ['growthPlanFeatureBooking', 'growthPlanFeatureAdmin'],
    highlighted: true,
  },
  {
    name: 'proPlan',
    description: 'proPlanDescription',
    features: ['proPlanFeatureCustom', 'proPlanFeatureSupport'],
  },
]

export default function HomePage() {
  const { t } = useLanguage()
  const restaurant = useRestaurantSettings()

  return (
    <main className="bg-stone-50 text-stone-900">
      <section className="relative min-h-[86vh] overflow-hidden">
        <img
          src={restaurant.heroImage}
          alt={restaurant.name}
          className="h-full min-h-[86vh] w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[2px] text-white backdrop-blur">
            {t('restaurantWebsiteDemo')}
          </p>

          <h1 className="mt-6 max-w-4xl !text-5xl font-bold leading-tight !text-white md:!text-6xl">
            {t('experienceDining')}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-100">
            {t('experienceText')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/reservation#reservation-form"
              className="rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-orange-600"
            >
              {t('bookTable')}
            </Link>
            <a
              href="#demo-request"
              className="rounded-full border border-white/70 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-stone-950"
            >
              {t('requestDemo')}
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[3px] text-orange-600">
            {t('forRestaurantOwners')}
          </p>
          <h2 className="mt-4 !text-4xl font-semibold leading-tight text-stone-950">
            {t('ownerSectionTitle')}
          </h2>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            {t('ownerSectionText')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-stone-800"
            >
              {t('viewMenuDemo')}
            </Link>
            <Link
              to="/reservation#reservation-form"
              className="rounded-full border border-stone-300 px-6 py-3 font-semibold text-stone-900 transition hover:border-orange-500 hover:text-orange-600"
            >
              {t('viewBookingDemo')}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ownerFeatures.map((feature) => (
            <div key={feature} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                ✓
              </div>
              <h3 className="text-xl font-semibold text-stone-950">
                {t(`${feature}Title`)}
              </h3>
              <p className="mt-3 leading-7 text-stone-600">
                {t(`${feature}Text`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="w-full">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[3px] text-orange-600">
              {t('whyItSells')}
            </p>
            <h2 className="mt-4 !text-4xl font-semibold leading-tight text-stone-950">
              {t('benefitsTitle')}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {businessBenefits.map((benefit) => (
              <div key={benefit} className="border-l-4 border-orange-500 bg-stone-50 p-6">
                <h3 className="text-xl font-semibold text-stone-950">
                  {t(`${benefit}Title`)}
                </h3>
                <p className="mt-3 leading-7 text-stone-600">
                  {t(`${benefit}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[3px] text-orange-600">
            {t('packages')}
          </p>
          <h2 className="mt-4 !text-4xl font-semibold leading-tight text-stone-950">
            {t('packagesTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-stone-600">
            {t('packagesText')}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-7 shadow-sm ${
                plan.highlighted
                  ? 'border-orange-500 bg-stone-950 text-white'
                  : 'border-stone-200 bg-white text-stone-950'
              }`}
            >
              <h3 className="text-2xl font-semibold">
                {t(plan.name)}
              </h3>
              <p className={`mt-3 leading-7 ${plan.highlighted ? 'text-stone-200' : 'text-stone-600'}`}>
                {t(plan.description)}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="font-bold text-orange-500">✓</span>
                    <span>{t(feature)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="demo-request" className="bg-orange-600 px-6 py-16 text-white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="text-center lg:text-left">
            <p className="text-sm font-bold uppercase tracking-[3px] text-orange-100">
              {t('readyToSell')}
            </p>
            <h2 className="mt-4 !text-4xl font-semibold leading-tight !text-white">
              {t('finalCtaTitle')}
            </h2>
            <p className="mt-4 leading-8 text-orange-50">
              {t('finalCtaText')}
            </p>
            <p className="mt-6 text-sm font-semibold text-orange-50">
              {restaurant.phone}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 text-stone-900 shadow-xl sm:p-8">
            <h3 className="mb-2 text-2xl font-semibold text-stone-950">
              {t('demoFormTitle')}
            </h3>
            <p className="mb-6 leading-7 text-stone-600">
              {t('demoFormText')}
            </p>
            <LeadForm />
          </div>
        </div>
      </section>
    </main>
  )
}
