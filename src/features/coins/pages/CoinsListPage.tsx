import { useCallback, useMemo } from 'react';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { useFavorites } from '../../../contexts/favorites';
import type { CoinMarket } from '../../../types/coingecko';
import { useSort } from '../../../hooks/useSort';
import { useCoinsQuery } from '../hooks/useCoinsQuery';
import { useCoinFilters } from '../hooks/useCoinFilters';
import { CoinFilters } from '../components/CoinFilters';
import { CoinsTable, type CoinSortKey } from '../components/CoinsTable';

const accessor = (item: CoinMarket, key: CoinSortKey) =>
  key === 'name' ? item.name : (item[key] as number | null | undefined);

export default function CoinsListPage() {
  const { data, isPending, isError, refetch, isFetching } = useCoinsQuery();
  const { has } = useFavorites();
  const { filters, setFilter, reset, apply } = useCoinFilters();

  const isFavorite = useCallback((id: string) => has(id), [has]);
  const filtered = useMemo(
    () => (data ? apply(data, isFavorite) : []),
    [data, apply, isFavorite],
  );

  const { sorted, sortKey, direction, toggleSort } = useSort<
    CoinMarket,
    CoinSortKey
  >(filtered, { key: 'market_cap_rank', direction: 'asc' }, accessor);

  return (
    <section className="space-y-4">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">Top 100 cryptocurrencies</h1>
        <span className="text-xs text-slate-500" aria-live="polite">
          {isFetching ? 'Refreshing…' : 'Live (refresh every 60s)'}
        </span>
      </header>

      <CoinFilters state={filters} setFilter={setFilter} reset={reset} />

      {isPending && <Spinner label="Loading coins…" />}
      {isError && (
        <ErrorState
          title="Couldn't load coins"
          message="The CoinGecko API returned an error or the network is unreachable."
          onRetry={() => void refetch()}
        />
      )}

      {!isPending && !isError && (
        <>
          <CoinsTable
            coins={sorted}
            sortKey={sortKey}
            direction={direction}
            onToggleSort={toggleSort}
          />
          <p className="text-xs text-slate-500">
            Showing {sorted.length} of {data?.length ?? 0} coins.
          </p>
        </>
      )}
    </section>
  );
}
