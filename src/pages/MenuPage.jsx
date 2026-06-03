import { useMemo, useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import MenuCard from '../components/menu/MenuCard'
import { useLanguage } from '../contexts/LanguageContext'
import { getMenuId, useMenusQuery } from '../hooks/useMenuQueries'
import { getMenuCategoryLabel } from '../utils/category'
import { formatPrice, getRawPriceValue } from '../utils/price'

export default function MenuPage() {
  const { t } = useLanguage()
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const { data: menus = [], isLoading } = useMenusQuery()

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      menus
        .map(getMenuCategoryLabel)
        .filter(Boolean),
    )

    return Array.from(uniqueCategories)
  }, [menus])

  const filteredMenus = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return [...menus]
      .filter((item) => {
        const category = getMenuCategoryLabel(item)
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory
        const searchableText = `${item.name || ''} ${item.description || ''}`.toLowerCase()
        const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)

        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        const firstPrice = Number(getRawPriceValue(a.price)) || 0
        const secondPrice = Number(getRawPriceValue(b.price)) || 0

        if (sortBy === 'priceAsc') return firstPrice - secondPrice
        if (sortBy === 'priceDesc') return secondPrice - firstPrice

        return 0
      })
  }, [menus, searchTerm, selectedCategory, sortBy])

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

      <div className="mb-10 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <label className="block">
          <span className="sr-only">{t('searchMenu')}</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('searchMenuPlaceholder')}
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="sr-only">{t('filterByCategory')}</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white md:w-52"
          >
            <option value="all">{t('allCategories')}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">{t('sortMenu')}</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white md:w-48"
          >
            <option value="default">{t('sortDefault')}</option>
            <option value="priceAsc">{t('sortPriceLowHigh')}</option>
            <option value="priceDesc">{t('sortPriceHighLow')}</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <LoadingState label={t('loadingMenu')} />
      ) : filteredMenus.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredMenus.map((item) => (
            <MenuCard
              key={getMenuId(item)}
              item={item}
              onClick={setSelectedMenu}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('noMenuResults')}
          description={t('tryDifferentMenuFilter')}
        />
      )}

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
                  {getMenuCategoryLabel(selectedMenu) && (
                    <p className="mt-2 text-sm font-medium uppercase tracking-wide text-orange-500">
                      {getMenuCategoryLabel(selectedMenu)}
                    </p>
                  )}
                </div>

                <span className="text-2xl font-bold text-orange-500">
                  ${formatPrice(selectedMenu.price)}
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
