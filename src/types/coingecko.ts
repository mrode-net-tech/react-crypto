/*
  Type definitions for the slice of the CoinGecko REST API we actually use.
  Only the fields the UI reads are listed — adding everything CoinGecko
  returns would be noise and a maintenance trap.
  See docs/api.md for the endpoints and query params.
*/

/** Supported `vs_currency` values. The app is USD-only for now. */
export type SupportedCurrency = 'usd';

/** `days` window for the market chart endpoint (matches the UI selector). */
export type MarketChartDays = 1 | 7 | 30 | 365;

/** Request params for `GET /coins/markets`. */
export interface CoinsMarketsParams {
  vs_currency: SupportedCurrency;
  order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc';
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  /** Comma-separated, e.g. `'1h,24h,7d'`. */
  price_change_percentage?: string;
}

/** A single row from `GET /coins/markets`. */
export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  last_updated: string;
  // Optional — present only when requested via `price_change_percentage`.
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
}

/** Localized text map keyed by language code (e.g. `'en'`). */
export type LocalizedText = Record<string, string>;

/** Per-currency numeric map (e.g. `{ usd: 12345.67, eur: ... }`). */
export type CurrencyMap = Record<string, number>;

/** A trimmed view of `GET /coins/{id}` — only what the details page renders. */
export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  description: LocalizedText;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
  };
  market_data: {
    current_price: CurrencyMap;
    market_cap: CurrencyMap;
    total_volume: CurrencyMap;
    high_24h: CurrencyMap | null;
    low_24h: CurrencyMap | null;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    price_change_percentage_30d: number | null;
    price_change_percentage_1y: number | null;
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
    ath: CurrencyMap;
    atl: CurrencyMap;
  };
  market_cap_rank: number | null;
  last_updated: string;
}

/*
  Raw response of `GET /coins/{id}/market_chart`: each series is an array of
  `[timestampMs, value]` tuples. The hook converts these to `MarketChartPoint`
  for easier consumption by Recharts.
*/
export interface CoinMarketChartResponse {
  prices: Array<[number, number]>;
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}

/** Normalized chart point — what components actually consume. */
export interface MarketChartPoint {
  /** Epoch milliseconds. */
  timestamp: number;
  price: number;
}
