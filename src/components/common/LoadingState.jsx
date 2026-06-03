export default function LoadingState({ label }) {
  return (
    <div className="flex min-h-40 items-center justify-center px-6 py-10 text-gray-500">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
