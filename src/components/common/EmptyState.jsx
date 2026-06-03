export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    </div>
  );
}
