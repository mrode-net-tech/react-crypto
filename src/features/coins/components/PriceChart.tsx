import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import {
  formatChartDate,
  formatChartDateTime,
  formatPrice,
} from '../../../lib/formatters';
import type { MarketChartDays } from '../../../types/coingecko';
import { useMarketChartQuery } from '../hooks/useMarketChartQuery';

const RANGE_OPTIONS: Array<{ value: MarketChartDays; label: string }> = [
  { value: 1, label: '24h' },
  { value: 7, label: '7d' },
  { value: 30, label: '30d' },
  { value: 365, label: '1y' },
];

interface PriceChartProps {
  coinId: string;
  days: MarketChartDays;
  onChangeDays: (days: MarketChartDays) => void;
}

interface ChartTooltipPayloadItem {
  payload?: { timestamp: number; price: number };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900/95">
      <div className="text-slate-500 dark:text-slate-400">
        {formatChartDateTime(point.timestamp)}
      </div>
      <div className="font-semibold">{formatPrice(point.price)}</div>
    </div>
  );
}

export function PriceChart({ coinId, days, onChangeDays }: PriceChartProps) {
  const { data, isPending, isError, refetch } = useMarketChartQuery({
    id: coinId,
    days,
  });

  // Memoize so Recharts doesn't see a new array reference on unrelated rerenders.
  const points = useMemo(() => data ?? [], [data]);

  return (
    <section
      aria-label="Price history"
      className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
    >
      <div
        role="tablist"
        aria-label="Chart range"
        className="mb-3 flex flex-wrap gap-2"
      >
        {RANGE_OPTIONS.map((opt) => {
          const selected = opt.value === days;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChangeDays(opt.value)}
              className={`h-8 rounded-md border px-3 text-xs font-medium ${
                selected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {isPending && <Spinner label="Loading chart…" />}
      {isError && (
        <ErrorState
          title="Couldn't load chart"
          message="The chart endpoint returned an error."
          onRetry={() => void refetch()}
        />
      )}
      {!isPending && !isError && points.length > 0 && (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={points}
              margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(v: number) => formatChartDate(v)}
                tick={{ fontSize: 11 }}
                minTickGap={32}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => formatPrice(v)}
                tick={{ fontSize: 11 }}
                width={80}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
