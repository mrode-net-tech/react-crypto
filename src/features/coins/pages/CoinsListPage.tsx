import { useMemo } from 'react';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { COINS_PER_PAGE } from '../../../config/queryConfig';
import { useFavorites } from '../../../contexts/favorites';
import { useCoinsQuery } from '../hooks/useCoinsQuery';
import { useCoinsControls } from '../hooks/useCoinsControls';
import { CoinFilters } from '../components/CoinFilters';
import { CoinsTable } from '../components/CoinsTable';

export default function CoinsListPage() {
  const { state, setOrder, setCategory, setPage, setFavoritesOnly, reset } =
    useCoinsControls();

  const { data, isPending, isError, refetch, isFetching } = useCoinsQuery({
    page: state.page,
    order: state.order,
    category: state.category,
  });

  const { has } = useFavorites();

  const visible = useMemo(() => {
    if (!data) return [];
    return state.favoritesOnly ? data.filter((c) => has(c.id)) : data;
  }, [data, state.favoritesOnly, has]);

  const hasNext = (data?.length ?? 0) >= COINS_PER_PAGE;

  return (
    <section className="space-y-4">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">Cryptocurrencies</h1>
        <span className="text-xs text-slate-500" aria-live="polite">
          {isFetching ? 'Refreshing…' : 'Live (refresh every 60s)'}
        </span>
      </header>

      <CoinFilters
        state={state}
        setCategory={setCategory}
        setFavoritesOnly={setFavoritesOnly}
        reset={reset}
      />

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
            coins={visible}
            order={state.order}
            onChangeOrder={setOrder}
          />
          <p className="text-xs text-slate-500">
            Showing {visible.length} of {data?.length ?? 0} coins on this page.
          </p>
          <Pagination
            page={state.page}
            hasNext={hasNext}
            isFetching={isFetching}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
