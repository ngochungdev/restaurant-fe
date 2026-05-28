import { useEffect, useState } from 'react'
import MenuCard from '../components/menu/MenuCard'
import menuService from '../services/menu.service'
import { useLanguage } from '../contexts/LanguageContext'

export default function MenuPage() {
  const { t } = useLanguage()
  const [menus, setMenus] = useState([])

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const data = await menuService.getAll()
      setMenus(data)
    } catch (error) {
      console.error(error)
    }
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
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  )
}