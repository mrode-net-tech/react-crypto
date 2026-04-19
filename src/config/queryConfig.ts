import type { MarketChartDays, SupportedCurrency } from '../types/coingecko';

/**
 * Centralized tuning knobs for the coins data layer.
 *
 * These are product / UX decisions (refresh cadence, page size, default
 * currency), not environment configuration — they don't change between
 * dev and prod, so they live in code (typed) rather than in `.env`
 * (stringly-typed, build-time only).
 */

export const COINS_REFRESH_INTERVAL_MS = 60_000;

export const COINS_STALE_TIME_MS = 60_000;

export const CHART_STALE_TIME_MS = 5 * 60_000;

export const COINS_PER_PAGE = 100;

export const DEFAULT_CURRENCY: SupportedCurrency = 'usd';

export const DEFAULT_CHART_DAYS: MarketChartDays = 7;
