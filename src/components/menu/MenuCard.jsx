export default function MenuCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-auto w-full bg-gray-50 object-contain"
      />

      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            {item.name}
          </h3>

          <span className="font-bold text-orange-500">
            ${item.price}
          </span>
        </div>

        <p className="mt-4 text-gray-600">
          {item.description}
        </p>
      </div>
    </button>
  )
}
