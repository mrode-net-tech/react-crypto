import { memo } from 'react';
import { formatPercent } from '../../../lib/formatters';

interface PriceChangeProps {
  value: number | null | undefined;
  ariaLabel?: string;
}

function PriceChangeBase({ value, ariaLabel }: PriceChangeProps) {
  const isFinite = value != null && Number.isFinite(value);
  const positive = isFinite && value > 0;
  const negative = isFinite && value < 0;

  const colorClass = positive
    ? 'text-emerald-600 dark:text-emerald-400'
    : negative
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-slate-500 dark:text-slate-400';

  return (
    <span
      className={`tabular-nums font-medium ${colorClass}`}
      aria-label={ariaLabel}
    >
      {formatPercent(value)}
    </span>
  );
}

export const PriceChange = memo(PriceChangeBase);
