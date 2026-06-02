import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }, [location.pathname, location.hash])

  return null
}
