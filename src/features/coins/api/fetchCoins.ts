import { fetchJson } from '../../../lib/apiClient';
import type { CoinMarket, SupportedCurrency } from '../../../types/coingecko';

export interface FetchCoinsArgs {
  vsCurrency: SupportedCurrency;
  page: number;
  perPage: number;
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
}: FetchCoinsArgs): Promise<CoinMarket[]> {
  return fetchJson<CoinMarket[]>('/coins/markets', {
    vs_currency: vsCurrency,
    order: 'market_cap_desc',
    per_page: perPage,
    page,
    sparkline: false,
    price_change_percentage: '1h,24h,7d',
  });
}
