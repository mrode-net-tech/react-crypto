import { useMemo } from 'react';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { COINS_PER_PAGE } from '../../../config/queryConfig';
import { useFavorites } from '../../../contexts/favorites';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useCoinsQuery } from '../hooks/useCoinsQuery';
import { useFavoriteCoinsQuery } from '../hooks/useFavoriteCoinsQuery';
import { useCoinsControls } from '../hooks/useCoinsControls';
import { CoinFilters } from '../components/CoinFilters';
import { CoinsTable } from '../components/CoinsTable';

export default function CoinsListPage() {
  useDocumentTitle('Cryptocurrencies');
  const {
    state,
    setOrder,
    setCategory,
    setPage,
    setFavoritesOnly,
    reset
  } = useCoinsControls();

  const { favorites } = useFavorites();
  const favoriteIds = useMemo(() => Array.from(favorites), [favorites]);

  const marketsQuery = useCoinsQuery({
    page: state.page,
    order: state.order,
    category: state.category,
  });

  const favoritesQuery = useFavoriteCoinsQuery({ ids: favoriteIds });

  const inFavoritesMode = state.favoritesOnly;
  const active = inFavoritesMode ? favoritesQuery : marketsQuery;
  const { data, isPending, isError, refetch, isFetching } = active;

  const noFavorites = inFavoritesMode && favoriteIds.length === 0;
  const hasNext = !inFavoritesMode && (data?.length ?? 0) >= COINS_PER_PAGE;

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

      {noFavorites && (
        <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
          You haven&apos;t starred any coins yet. Click the ☆ icon on any row.
        </p>
      )}

      {!noFavorites && isPending && <Spinner label="Loading coins…" />}
      {!noFavorites && isError && (
        <ErrorState
          title="Couldn't load coins"
          message="The CoinGecko API returned an error or the network is unreachable."
          onRetry={() => void refetch()}
        />
      )}

      {!noFavorites && !isPending && !isError && (
        <>
          <CoinsTable
            coins={data ?? []}
            order={state.order}
            onChangeOrder={inFavoritesMode ? undefined : setOrder}
          />
          {!inFavoritesMode && (
            <Pagination
              page={state.page}
              hasNext={hasNext}
              isFetching={isFetching}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </section>
  );
}
