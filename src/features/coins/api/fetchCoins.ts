import { fetchJson, type QueryParamPrimitive } from '../../../lib/apiClient';
import type {
  CoinMarket,
  CoinsOrder,
  SupportedCurrency,
} from '../../../types/coingecko';

export interface FetchCoinsArgs {
  vsCurrency: SupportedCurrency;
  page: number;
  perPage: number;
  order: CoinsOrder;
  category: string | null;
  /** Restrict the response to a fixed set of coin ids (CoinGecko `ids=` csv). */
  ids?: readonly string[];
}

/**
 * `GET /coins/markets` — paginated list of coins with market data.
 * Always asks for the 1h/24h/7d percentage changes so the table can render
 * them without a second request.
 */
export function fetchCoins({
  vsCurrency,
  page,
  perPage,
  order,
  category,
  ids,
}: FetchCoinsArgs): Promise<CoinMarket[]> {
  const params: Record<string, QueryParamPrimitive | undefined> = {
    vs_currency: vsCurrency,
    order,
    per_page: perPage,
    page,
    sparkline: false,
    price_change_percentage: '1h,24h,7d',
  };
  if (category) params.category = category;
  if (ids && ids.length > 0) params.ids = ids.join(',');
  return fetchJson<CoinMarket[]>('/coins/markets', params);
}
