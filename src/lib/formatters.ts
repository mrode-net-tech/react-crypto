/*
  Number formatters used across the app. Centralizing them keeps the UI
  consistent (one decimal style for prices, one for percent, one for
  large compact numbers) and makes changing locale a single-file edit.

  All formatters tolerate `null | undefined` so call sites stay tidy.
*/

const PLACEHOLDER = '—';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const microPriceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 6,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function formatPrice(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;
  // Use higher precision for sub-dollar prices so "0.00" never appears.
  return value < 1
    ? microPriceFormatter.format(value)
    : priceFormatter.format(value);
}

/** Accepts a percentage **already in percent units** (e.g. `4.21` → `+4.21%`). */
export function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;
  return percentFormatter.format(value / 100);
}

export function formatMarketCap(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;
  return compactFormatter.format(value);
}

export function formatVolume(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;
  return compactFormatter.format(value);
}
