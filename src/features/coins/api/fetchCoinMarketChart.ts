import { fetchJson } from '../../../lib/apiClient';
import type {
  CoinMarketChartResponse,
  MarketChartDays,
  MarketChartPoint,
  SupportedCurrency,
} from '../../../types/coingecko';

export interface FetchCoinMarketChartArgs {
  id: string;
  days: MarketChartDays;
  vsCurrency: SupportedCurrency;
}

/**
 * `GET /coins/{id}/market_chart` — historical price/volume series.
 * The raw response is an array of `[timestamp, price]` tuples; we normalize
 * it to `MarketChartPoint[]` so Recharts (and tests) can consume named
 * fields instead of indexed tuples.
 */
export async function fetchCoinMarketChart({
  id,
  days,
  vsCurrency,
}: FetchCoinMarketChartArgs): Promise<MarketChartPoint[]> {
  const response = await fetchJson<CoinMarketChartResponse>(
    `/coins/${encodeURIComponent(id)}/market_chart`,
    {
      vs_currency: vsCurrency,
      days,
    },
  );

  return response.prices.map(([timestamp, price]) => ({ timestamp, price }));
}
