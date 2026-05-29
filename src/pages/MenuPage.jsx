import { useState } from 'react'
import MenuCard from '../components/menu/MenuCard'
import { useLanguage } from '../contexts/LanguageContext'
import { getMenuId, useMenusQuery } from '../hooks/useMenuQueries'

export default function MenuPage() {
  const { t } = useLanguage()
  const [selectedMenu, setSelectedMenu] = useState(null)
  const { data: menus = [] } = useMenusQuery()

  const closeModal = () => {
    setSelectedMenu(null)
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-bold">
          {t('menuTitle')}
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {menus && menus.map((item) => (
          <MenuCard
            key={getMenuId(item)}
            item={item}
            onClick={setSelectedMenu}
          />
        ))}
      </div>

      {selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="relative">
              <img
                src={selectedMenu.image}
                alt={selectedMenu.name}
                className="max-h-[70vh] w-full rounded-t-3xl bg-gray-50 object-contain"
              />
              <button
                type="button"
                onClick={closeModal}
                aria-label={t('close')}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-700 shadow transition hover:bg-white"
              >
                ×
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-semibold text-gray-900">
                    {selectedMenu.name}
                  </h3>
                  {selectedMenu.category && (
                    <p className="mt-2 text-sm font-medium uppercase tracking-wide text-orange-500">
                      {selectedMenu.category}
                    </p>
                  )}
                </div>

                <span className="text-2xl font-bold text-orange-500">
                  ${selectedMenu.price}
                </span>
              </div>

              <p className="mt-6 text-gray-600">
                {selectedMenu.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
