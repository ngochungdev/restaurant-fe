import { restaurantConfig } from '../../config/restaurant'

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-10 text-center text-white">
      <h2 className="text-2xl font-bold">
        {restaurantConfig.name}
      </h2>

      <p className="mt-4 text-gray-400">
        {restaurantConfig.address}
      </p>
    </footer>
  )
}
