import { useMemo } from 'react';
import { useCategoriesQuery } from '../hooks/useCategoriesQuery';
import type { UseCoinsControlsResult } from '../hooks/useCoinsControls';

interface CoinFiltersProps {
  state: UseCoinsControlsResult['state'];
  setCategory: UseCoinsControlsResult['setCategory'];
  setFavoritesOnly: UseCoinsControlsResult['setFavoritesOnly'];
  reset: UseCoinsControlsResult['reset'];
}

const fieldClass =
  'h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-950';
const labelTextClass =
  'text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400';

export function CoinFilters({
  state,
  setCategory,
  setFavoritesOnly,
  reset,
}: CoinFiltersProps) {
  const { data: categories, isPending } = useCategoriesQuery();

  const sorted = useMemo(
    () =>
      categories
        ? [...categories].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [categories],
  );

  return (
    <section
      aria-label="Filters"
      className="flex flex-wrap items-end gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <label className="flex w-72 max-w-full flex-col gap-1">
        <span className={labelTextClass}>Category</span>
        <select
          value={state.category ?? ''}
          onChange={(e) => setCategory(e.target.value || null)}
          disabled={isPending}
          className={fieldClass}
        >
          <option value="">All categories</option>
          {sorted.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
        <input
          type="checkbox"
          checked={state.favoritesOnly}
          onChange={(e) => setFavoritesOnly(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Favorites only</span>
      </label>

      <button
        type="button"
        onClick={reset}
        className="ml-auto h-9 rounded-md border border-slate-300 px-3 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Reset
      </button>
    </section>
  );
}
