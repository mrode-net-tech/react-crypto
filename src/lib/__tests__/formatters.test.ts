import { describe, expect, it } from 'vitest';
import {
  formatChartDate,
  formatChartDateTime,
  formatMarketCap,
  formatPercent,
  formatPrice,
  formatVolume,
} from '../formatters';

describe('formatPrice', () => {
  it('formats integer prices with two decimals', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50');
  });

  it('uses higher precision for sub-dollar values', () => {
    expect(formatPrice(0.012345)).toBe('$0.012345');
  });

  it('returns placeholder for null / undefined / NaN', () => {
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice(undefined)).toBe('—');
    expect(formatPrice(Number.NaN)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('renders signed percent', () => {
    expect(formatPercent(4.21)).toBe('+4.21%');
    expect(formatPercent(-1.5)).toBe('-1.50%');
  });

  it('returns placeholder for null', () => {
    expect(formatPercent(null)).toBe('—');
  });
});

describe('formatMarketCap / formatVolume', () => {
  it('uses compact notation', () => {
    expect(formatMarketCap(1_500_000_000)).toBe('$1.5B');
    expect(formatVolume(2_400_000)).toBe('$2.4M');
  });

  it('returns placeholder for null', () => {
    expect(formatMarketCap(null)).toBe('—');
    expect(formatVolume(undefined)).toBe('—');
  });
});

describe('formatChartDate / formatChartDateTime', () => {
  // Format shape only — the runner's locale timezone affects the exact string.
  const ts = Date.UTC(2024, 3, 19, 14, 30);

  it('produces a short month/day label', () => {
    expect(formatChartDate(ts)).toMatch(/[A-Z][a-z]{2} \d+/);
  });

  it('produces a date+time label', () => {
    expect(formatChartDateTime(ts)).toMatch(/\d{2}:\d{2}/);
  });
});
