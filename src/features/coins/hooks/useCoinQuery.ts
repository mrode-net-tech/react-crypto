import { useQuery } from '@tanstack/react-query';
import { fetchCoinById } from '../api/fetchCoinById';
import { queryKeys } from '../../../lib/queryKeys';
import { COINS_STALE_TIME_MS } from '../../../config/queryConfig';

/**
 * Coin details query. `enabled` guards against running with an empty `id`
 * during the brief moment React Router resolves the route param.
 */
export function useCoinQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.coins.detail(id ?? ''),
    queryFn: () => fetchCoinById(id as string),
    enabled: Boolean(id),
    staleTime: COINS_STALE_TIME_MS,
  });
}
