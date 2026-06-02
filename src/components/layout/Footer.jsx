import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'

export default function Footer() {
  const restaurant = useRestaurantSettings()

  return (
    <footer className="bg-black px-6 py-10 text-center text-white">
      <h2 className="text-2xl font-bold text-gray-400">
        {restaurant.name}
      </h2>

      <p className="mt-4 text-gray-400">
        {restaurant.address}
      </p>
    </footer>
  )
}
