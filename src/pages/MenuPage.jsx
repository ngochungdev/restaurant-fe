import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import MenuCard from '../components/menu/MenuCard'
import menuService from '../services/menu.service'
import { useLanguage } from '../contexts/LanguageContext'
import useAuthStore from '../stores/auth.store'

const getMenuId = (item) => item?.id || item?._id

export default function MenuPage() {
  const { t } = useLanguage()
  const { user } = useAuthStore()
  const [menus, setMenus] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  })
  const [imageData, setImageData] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    if (!selectedMenu) return

    setForm({
      name: selectedMenu.name || '',
      price: selectedMenu.price || '',
      category: selectedMenu.category || '',
      description: selectedMenu.description || '',
    })
    setImageData('')
    setPreview(selectedMenu.image || '')
    setIsEditing(false)
  }, [selectedMenu])

  const fetchMenus = async () => {
    try {
      const data = await menuService.getAll()
      setMenus(Array.isArray(data) ? data : data.items || data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const showApiError = (error, fallback) => {
    const detail = error?.response?.data

    if (!detail) {
      toast.error(fallback)
      return
    }

    const errors = detail.errors || detail.message || detail
    if (Array.isArray(errors)) {
      errors.forEach((msg) => toast.error(msg))
    } else if (typeof errors === 'object') {
      Object.values(errors).flat().forEach((msg) => {
        if (typeof msg === 'string') toast.error(msg)
      })
    } else {
      toast.error(String(errors))
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result || '')
      setPreview(reader.result || '')
    }
    reader.readAsDataURL(file)
  }

  const handleUpdate = async () => {
    if (!selectedMenu || !form.name || !form.price || !form.category || !form.description) {
      toast.error(t('fillMenuFields'))
      return
    }

    const id = getMenuId(selectedMenu)
    const payload = {
      ...form,
      image: imageData || selectedMenu.image,
    }

    try {
      setLoading(true)
      const updated = await menuService.update(id, payload)
      const responseItem = updated?.data || updated?.item || (updated?.name ? updated : null)
      const nextItem = { ...selectedMenu, ...payload, ...(responseItem || {}) }

      setMenus((current) =>
        current.map((item) =>
          getMenuId(item) === id ? nextItem : item,
        ),
      )
      setSelectedMenu(nextItem)
      setIsEditing(false)
      toast.success(t('updateMenuSuccess'))
    } catch (error) {
      console.error(error)
      showApiError(error, t('updateMenuFail'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMenu || !window.confirm(t('confirmDeleteMenu'))) return

    const id = getMenuId(selectedMenu)

    try {
      setLoading(true)
      await menuService.delete(id)
      setMenus((current) => current.filter((item) => getMenuId(item) !== id))
      setSelectedMenu(null)
      toast.success(t('deleteMenuSuccess'))
    } catch (error) {
      console.error(error)
      showApiError(error, t('deleteMenuFail'))
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    if (loading) return
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
                src={preview || selectedMenu.image}
                alt={selectedMenu.name}
                className="max-h-[70vh] w-full rounded-t-3xl bg-gray-50 object-contain"
              />
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                aria-label={t('close')}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-gray-700 shadow transition hover:bg-white disabled:opacity-60"
              >
                ×
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {!isEditing ? (
                <>
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

                  {isAdmin && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        {t('editMenu')}
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? t('submitting') : t('deleteMenu')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid gap-5">
                  <h3 className="text-2xl font-semibold text-gray-900">{t('editMenu')}</h3>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">{t('menuName')}</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">{t('price')}</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">{t('category')}</span>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">{t('description')}</span>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">{t('image')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      aria-label={t('uploadImage')}
                      className="mt-2 w-full text-sm text-gray-700 file:rounded-xl file:border file:border-gray-300 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      disabled={loading}
                      className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? t('submitting') : t('saveChanges')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                      className="rounded-2xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
