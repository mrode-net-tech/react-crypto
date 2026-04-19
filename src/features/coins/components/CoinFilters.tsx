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

export function CoinFilters({ state, setFilter, reset }: CoinFiltersProps) {
  const onNumber =
    (key: keyof CoinFiltersState) => (e: ChangeEvent<HTMLInputElement>) =>
      setFilter(key, toNumberOrNull(e.target.value) as never);

  return (
    <section
      aria-label="Filters"
      className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 md:grid-cols-3 lg:grid-cols-6"
    >
      <label className="flex flex-col text-sm md:col-span-2">
        <span className="mb-1 text-slate-600 dark:text-slate-400">Search</span>
        <input
          type="search"
          value={state.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Bitcoin, BTC…"
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-600 dark:text-slate-400">
          Min price (USD)
        </span>
        <input
          type="number"
          inputMode="decimal"
          value={state.minPrice ?? ''}
          onChange={onNumber('minPrice')}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-600 dark:text-slate-400">
          Max price (USD)
        </span>
        <input
          type="number"
          inputMode="decimal"
          value={state.maxPrice ?? ''}
          onChange={onNumber('maxPrice')}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-600 dark:text-slate-400">
          Min market cap
        </span>
        <input
          type="number"
          inputMode="numeric"
          value={state.minMarketCap ?? ''}
          onChange={onNumber('minMarketCap')}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-600 dark:text-slate-400">
          Min volume
        </span>
        <input
          type="number"
          inputMode="numeric"
          value={state.minVolume ?? ''}
          onChange={onNumber('minVolume')}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-600 dark:text-slate-400">Trend</span>
        <select
          value={state.trend}
          onChange={(e) =>
            setFilter('trend', e.target.value as GainersLosersFilter)
          }
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="all">All</option>
          <option value="gainers">Gainers (24h)</option>
          <option value="losers">Losers (24h)</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={state.favoritesOnly}
          onChange={(e) => setFilter('favoritesOnly', e.target.checked)}
          className="h-4 w-4"
        />
        <span>Favorites only</span>
      </label>

      <div className="flex items-end">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
