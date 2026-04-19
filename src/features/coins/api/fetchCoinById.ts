import { fetchJson } from '../../../lib/apiClient';
import type { CoinDetails } from '../../../types/coingecko';

/**
 * `GET /coins/{id}` — detailed info for a single coin.
 *
 * The non-essential blobs (tickers, community/developer data, sparkline) are
 * disabled to keep the payload small; the details page only needs the core
 * description, links, and market data.
 */
export function fetchCoinById(id: string): Promise<CoinDetails> {
  return fetchJson<CoinDetails>(`/coins/${encodeURIComponent(id)}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  });
}
