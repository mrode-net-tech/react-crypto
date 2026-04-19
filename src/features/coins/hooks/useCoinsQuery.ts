import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCoins } from '../api/fetchCoins';
import { queryKeys } from '../../../lib/queryKeys';
import {
  COINS_PER_PAGE,
  COINS_REFRESH_INTERVAL_MS,
  COINS_STALE_TIME_MS,
  DEFAULT_CURRENCY,
} from '../../../config/queryConfig';
import type { CoinsOrder, SupportedCurrency } from '../../../types/coingecko';

export interface UseCoinsQueryArgs {
  vsCurrency?: SupportedCurrency;
  page?: number;
  perPage?: number;
  order?: CoinsOrder;
  category?: string | null;
}

/**
 * Coins list query.
 *
 * Server-driven inputs (`page`, `order`, `category`) flow through to
 * the URL — every change refetches with a different cache key. Pure
 * client-only concerns (favorites filter) live elsewhere.
 */
export function useCoinsQuery({
  vsCurrency = DEFAULT_CURRENCY,
  page = 1,
  perPage = COINS_PER_PAGE,
  order = 'market_cap_desc',
  category = null,
}: UseCoinsQueryArgs = {}) {
  return useQuery({
    queryKey: queryKeys.coins.list({
      vsCurrency,
      page,
      perPage,
      order,
      category,
    }),
    queryFn: () => fetchCoins({ vsCurrency, page, perPage, order, category }),
    staleTime: COINS_STALE_TIME_MS,
    refetchInterval: COINS_REFRESH_INTERVAL_MS,
    placeholderData: keepPreviousData,
  });
}
