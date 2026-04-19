import type { MarketChartDays, SupportedCurrency } from '../types/coingecko';

/*
  Centralized TanStack Query keys (factory pattern).

  Why: every cache lookup, invalidation, or prefetch in the app references
  one of these. Keeping them in one file means we can never typo a key in
  one place and silently miss the cache in another. `as const` preserves
  literal types so TS can narrow on them.
*/

export interface CoinsListParams {
  vsCurrency: SupportedCurrency;
  page: number;
  perPage: number;
}

export const queryKeys = {
  coins: {
    all: ['coins'] as const,
    list: (params: CoinsListParams) => ['coins', 'list', params] as const,
    detail: (id: string) => ['coins', 'detail', id] as const,
    chart: (id: string, days: MarketChartDays) =>
      ['coins', 'chart', id, days] as const,
  },
} as const;
