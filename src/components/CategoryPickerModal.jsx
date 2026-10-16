"use client";

export default function CategoryPickerModal({
  categories = [],
  activePlayerName = "the active player",
  isOpen,
  onSelect,
}) {
  if (!isOpen) return null;

  return (
    <div
      aria-labelledby="category-picker-title"
      aria-modal="true"
      className="fixed inset-0 z-30 grid place-items-center bg-slate-950/90 p-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-4xl rounded-3xl border border-amber-400/40 bg-slate-900 p-8 shadow-2xl shadow-amber-950/40">
        <p className="text-center text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
          New round
        </p>
        <h2 className="mt-3 text-center text-3xl font-black sm:text-5xl" id="category-picker-title">
          {activePlayerName}, choose a category
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <button
              className="min-h-36 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-xl font-black text-slate-100 transition hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
              key={category}
              onClick={() => onSelect(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
