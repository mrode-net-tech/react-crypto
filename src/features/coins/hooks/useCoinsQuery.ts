import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCoins } from '../api/fetchCoins';
import { queryKeys } from '../../../lib/queryKeys';
import type { SupportedCurrency } from '../../../types/coingecko';

export interface UseCoinsQueryArgs {
  vsCurrency?: SupportedCurrency;
  page?: number;
  perPage?: number;
}

/**
 * Coins list query.
 *
 * - `staleTime: 60_000` — match the auto-refresh cadence; remounts within a
 *   minute reuse the cache instead of firing a new request.
 * - `refetchInterval: 60_000` — satisfies the PDF spec ("real-time updates,
 *   60s interval"). Only this query polls; defaults from `queryClient.ts`
 *   keep everything else quiet.
 * - `placeholderData: keepPreviousData` — when `page` changes, the table
 *   keeps showing the previous page until the next one arrives, so the UI
 *   doesn't flash a spinner / collapse to zero rows.
 */
export function useCoinsQuery({
  vsCurrency = 'usd',
  page = 1,
  perPage = 100,
}: UseCoinsQueryArgs = {}) {
  return useQuery({
    queryKey: queryKeys.coins.list({ vsCurrency, page, perPage }),
    queryFn: () => fetchCoins({ vsCurrency, page, perPage }),
    staleTime: 60_000,
    refetchInterval: 60_000,
    placeholderData: keepPreviousData,
  });
}
