export default function MenuCard({ item }) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={item.image}
        alt={item.name}
        className="h-64 w-full object-cover"
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
    </div>
  )
}