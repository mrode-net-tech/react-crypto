import { useCallback, useMemo, useState } from 'react';
import type { CoinMarket } from '../../../types/coingecko';

export type GainersLosersFilter = 'all' | 'gainers' | 'losers';

export interface CoinFiltersState {
  search: string;
  minPrice: number | null;
  maxPrice: number | null;
  minMarketCap: number | null;
  minVolume: number | null;
  trend: GainersLosersFilter;
  favoritesOnly: boolean;
}

const INITIAL_STATE: CoinFiltersState = {
  search: '',
  minPrice: null,
  maxPrice: null,
  minMarketCap: null,
  minVolume: null,
  trend: 'all',
  favoritesOnly: false,
};

export interface UseCoinFiltersResult {
  filters: CoinFiltersState;
  setFilter: <K extends keyof CoinFiltersState>(
    key: K,
    value: CoinFiltersState[K],
  ) => void;
  reset: () => void;
  apply: (
    coins: CoinMarket[],
    isFavorite: (id: string) => boolean,
  ) => CoinMarket[];
}

export function useCoinFilters(): UseCoinFiltersResult {
  const [filters, setFilters] = useState<CoinFiltersState>(INITIAL_STATE);

  const setFilter = useCallback(
    <K extends keyof CoinFiltersState>(key: K, value: CoinFiltersState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setFilters(INITIAL_STATE), []);

  const apply = useCallback(
    (coins: CoinMarket[], isFavorite: (id: string) => boolean) => {
      const search = filters.search.trim().toLowerCase();
      return coins.filter((c) => {
        if (search) {
          const hay = `${c.name} ${c.symbol}`.toLowerCase();
          if (!hay.includes(search)) return false;
        }
        if (filters.minPrice != null && c.current_price < filters.minPrice)
          return false;
        if (filters.maxPrice != null && c.current_price > filters.maxPrice)
          return false;
        if (
          filters.minMarketCap != null &&
          (c.market_cap ?? 0) < filters.minMarketCap
        )
          return false;
        if (
          filters.minVolume != null &&
          (c.total_volume ?? 0) < filters.minVolume
        )
          return false;
        const change = c.price_change_percentage_24h_in_currency ?? 0;
        if (filters.trend === 'gainers' && change <= 0) return false;
        if (filters.trend === 'losers' && change >= 0) return false;
        if (filters.favoritesOnly && !isFavorite(c.id)) return false;
        return true;
      });
    },
    [filters],
  );

  return useMemo(
    () => ({ filters, setFilter, reset, apply }),
    [filters, setFilter, reset, apply],
  );
}
