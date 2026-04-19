import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { DEFAULT_CHART_DAYS } from '../../../config/queryConfig';
import {
  formatMarketCap,
  formatPercent,
  formatPrice,
  formatVolume,
} from '../../../lib/formatters';
import type { MarketChartDays } from '../../../types/coingecko';
import { useCoinQuery } from '../hooks/useCoinQuery';
import { FavoriteButton } from '../components/FavoriteButton';
import { PriceChart } from '../components/PriceChart';

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}

export default function CoinDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, refetch } = useCoinQuery(id);
  const [days, setDays] = useState<MarketChartDays>(DEFAULT_CHART_DAYS);

  return (
    <section className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline dark:text-emerald-400"
      >
        ← Back to coins
      </Link>

      {isPending && <Spinner label="Loading coin…" />}
      {isError && (
        <ErrorState
          title="Couldn't load coin"
          message="The CoinGecko API returned an error or the coin id is unknown."
          onRetry={() => void refetch()}
        />
      )}

      {!isPending && !isError && data && (
        <>
          <header className="flex flex-wrap items-center gap-4">
            <img
              src={data.image.large}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full"
            />
            <div className="flex-1">
              <h1 className="flex items-center gap-3 text-2xl font-semibold">
                <span>{data.name}</span>
                <span className="text-base font-normal text-slate-500 uppercase">
                  {data.symbol}
                </span>
                {data.market_cap_rank != null && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Rank #{data.market_cap_rank}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-2xl font-bold">
                {formatPrice(data.market_data.current_price.usd)}
                <span className="ml-3 text-base font-normal">
                  <span
                    className={
                      (data.market_data.price_change_percentage_24h ?? 0) >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }
                  >
                    {formatPercent(
                      data.market_data.price_change_percentage_24h,
                    )}{' '}
                    (24h)
                  </span>
                </span>
              </p>
            </div>
            <FavoriteButton coinId={data.id} coinName={data.name} />
          </header>

          <PriceChart coinId={data.id} days={days} onChangeDays={setDays} />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat
              label="Market Cap"
              value={formatMarketCap(data.market_data.market_cap.usd)}
            />
            <Stat
              label="Volume (24h)"
              value={formatVolume(data.market_data.total_volume.usd)}
            />
            <Stat
              label="High (24h)"
              value={formatPrice(data.market_data.high_24h?.usd ?? null)}
            />
            <Stat
              label="Low (24h)"
              value={formatPrice(data.market_data.low_24h?.usd ?? null)}
            />
            <Stat
              label="ATH"
              value={formatPrice(data.market_data.ath.usd)}
            />
            <Stat
              label="ATL"
              value={formatPrice(data.market_data.atl.usd)}
            />
            <Stat
              label="Circulating supply"
              value={
                data.market_data.circulating_supply != null
                  ? data.market_data.circulating_supply.toLocaleString('en-US')
                  : '—'
              }
            />
            <Stat
              label="Max supply"
              value={
                data.market_data.max_supply != null
                  ? data.market_data.max_supply.toLocaleString('en-US')
                  : '—'
              }
            />
          </dl>

          {data.description.en && (
            <article aria-label="About">
              <h2 className="mb-2 text-lg font-semibold">About {data.name}</h2>
              <div
                className="prose prose-sm max-w-none text-slate-700 dark:prose-invert dark:text-slate-300 [&_a]:text-emerald-600 dark:[&_a]:text-emerald-400 [&_a]:underline"
                // CoinGecko returns HTML in description.en; DOMPurify strips
                // any script/event handler before we hand it to React.
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.description.en, {
                    ALLOWED_TAGS: ['a', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
                    ALLOWED_ATTR: ['href', 'target', 'rel'],
                  }),
                }}
              />
            </article>
          )}
        </>
      )}
    </section>
  );
}
