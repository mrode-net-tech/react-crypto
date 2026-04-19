import { useQuery } from '@tanstack/react-query';
import { fetchCoinMarketChart } from '../api/fetchCoinMarketChart';
import { queryKeys } from '../../../lib/queryKeys';
import type {
  MarketChartDays,
  SupportedCurrency,
} from '../../../types/coingecko';

export interface UseMarketChartQueryArgs {
  id: string | undefined;
  days: MarketChartDays;
  vsCurrency?: SupportedCurrency;
}

/**
 * Historical price series for the chart on the details page.
 * Long `staleTime` (5 min) — historical data barely moves, no need to
 * refetch on every range toggle within the same window.
 */
export function useMarketChartQuery({
  id,
  days,
  vsCurrency = 'usd',
}: UseMarketChartQueryArgs) {
  return useQuery({
    queryKey: queryKeys.coins.chart(id ?? '', days),
    queryFn: () => fetchCoinMarketChart({ id: id as string, days, vsCurrency }),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  });
}
