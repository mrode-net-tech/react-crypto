import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCoins } from '../api/fetchCoins';
import { queryKeys } from '../../../lib/queryKeys';
import {
  COINS_REFRESH_INTERVAL_MS,
  COINS_STALE_TIME_MS,
  DEFAULT_CURRENCY,
} from '../../../config/queryConfig';
import type { SupportedCurrency } from '../../../types/coingecko';

export interface UseFavoriteCoinsQueryArgs {
  ids: readonly string[];
  vsCurrency?: SupportedCurrency;
}

/**
 * Fetches market data for an explicit list of coin ids via `?ids=`.
 * Used by the "favorites only" view so favorites from any market-cap rank
 * are visible in a single response (no client-side page filtering).
 *
 * The query is disabled when no ids are passed — we don't want to hit
 * `/coins/markets` with an empty filter (it would return the full list).
 */
export function useFavoriteCoinsQuery({
  ids,
  vsCurrency = DEFAULT_CURRENCY,
}: UseFavoriteCoinsQueryArgs) {
  const sortedIds = [...ids].sort();

  return useQuery({
    queryKey: queryKeys.coins.favorites({ vsCurrency, ids: sortedIds }),
    queryFn: () =>
      fetchCoins({
        vsCurrency,
        page: 1,
        perPage: Math.max(sortedIds.length, 1),
        order: 'market_cap_desc',
        category: null,
        ids: sortedIds,
      }),
    enabled: sortedIds.length > 0,
    staleTime: COINS_STALE_TIME_MS,
    refetchInterval: COINS_REFRESH_INTERVAL_MS,
    placeholderData: keepPreviousData,
  });
}
