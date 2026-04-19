import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { CoinMarket } from '../../../types/coingecko';
import {
  formatMarketCap,
  formatPrice,
  formatVolume,
} from '../../../lib/formatters';
import { PriceChange } from './PriceChange';
import { FavoriteButton } from './FavoriteButton';

interface CoinRowProps {
  coin: CoinMarket;
}

function CoinRowBase({ coin }: CoinRowProps) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
      <td className="px-3 py-3">
        <FavoriteButton coinId={coin.id} coinName={coin.name} />
      </td>
      <td className="px-3 py-3 text-sm text-slate-500 tabular-nums">
        {coin.market_cap_rank ?? '—'}
      </td>
      <td className="px-3 py-3">
        <Link
          to={`/coin/${coin.id}`}
          className="flex items-center gap-2 font-medium hover:underline"
        >
          <img
            src={coin.image}
            alt=""
            width={20}
            height={20}
            loading="lazy"
            className="h-5 w-5"
          />
          <span>{coin.name}</span>
          <span className="text-xs uppercase text-slate-500">
            {coin.symbol}
          </span>
        </Link>
      </td>
      <td className="px-3 py-3 text-right tabular-nums">
        {formatPrice(coin.current_price)}
      </td>
      <td className="px-3 py-3 text-right">
        <PriceChange
          value={coin.price_change_percentage_1h_in_currency}
          ariaLabel={`${coin.name} 1 hour change`}
        />
      </td>
      <td className="px-3 py-3 text-right">
        <PriceChange
          value={coin.price_change_percentage_24h_in_currency}
          ariaLabel={`${coin.name} 24 hour change`}
        />
      </td>
      <td className="px-3 py-3 text-right">
        <PriceChange
          value={coin.price_change_percentage_7d_in_currency}
          ariaLabel={`${coin.name} 7 day change`}
        />
      </td>
      <td className="px-3 py-3 text-right tabular-nums">
        {formatMarketCap(coin.market_cap)}
      </td>
      <td className="px-3 py-3 text-right tabular-nums">
        {formatVolume(coin.total_volume)}
      </td>
    </tr>
  );
}

export const CoinRow = memo(CoinRowBase);
