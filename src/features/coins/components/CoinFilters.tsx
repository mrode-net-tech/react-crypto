import type { ChangeEvent } from 'react';
import type {
  CoinFiltersState,
  GainersLosersFilter,
  UseCoinFiltersResult,
} from '../hooks/useCoinFilters';

interface CoinFiltersProps {
  state: CoinFiltersState;
  setFilter: UseCoinFiltersResult['setFilter'];
  reset: () => void;
}

function toNumberOrNull(v: string): number | null {
  if (v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const fieldClass =
  'h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-950';
const labelClass = 'flex flex-col gap-1';
const labelTextClass =
  'text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400';

export function CoinFilters({ state, setFilter, reset }: CoinFiltersProps) {
  const onNumber =
    (key: keyof CoinFiltersState) => (e: ChangeEvent<HTMLInputElement>) =>
      setFilter(key, toNumberOrNull(e.target.value) as never);

  return (
    <section
      aria-label="Filters"
      className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <label className={`${labelClass} sm:col-span-2 lg:col-span-2`}>
          <span className={labelTextClass}>Search</span>
          <input
            type="search"
            value={state.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Bitcoin, BTC…"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Min price</span>
          <input
            type="number"
            inputMode="decimal"
            value={state.minPrice ?? ''}
            onChange={onNumber('minPrice')}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Max price</span>
          <input
            type="number"
            inputMode="decimal"
            value={state.maxPrice ?? ''}
            onChange={onNumber('maxPrice')}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Min market cap</span>
          <input
            type="number"
            inputMode="numeric"
            value={state.minMarketCap ?? ''}
            onChange={onNumber('minMarketCap')}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Min volume</span>
          <input
            type="number"
            inputMode="numeric"
            value={state.minVolume ?? ''}
            onChange={onNumber('minVolume')}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
        <label className={`${labelClass} w-40`}>
          <span className={labelTextClass}>Trend (24h)</span>
          <select
            value={state.trend}
            onChange={(e) =>
              setFilter('trend', e.target.value as GainersLosersFilter)
            }
            className={fieldClass}
          >
            <option value="all">All</option>
            <option value="gainers">Gainers</option>
            <option value="losers">Losers</option>
          </select>
        </label>

        <label className="flex h-9 cursor-pointer items-center gap-2 self-end rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
          <input
            type="checkbox"
            checked={state.favoritesOnly}
            onChange={(e) => setFilter('favoritesOnly', e.target.checked)}
            className="h-4 w-4"
          />
          <span>Favorites only</span>
        </label>

        <button
          type="button"
          onClick={reset}
          className="ml-auto h-9 rounded-md border border-slate-300 px-3 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}
