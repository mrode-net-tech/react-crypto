import type { CoinMarket } from '../../../types/coingecko';
import { CoinRow } from './CoinRow';
import type { SortDirection } from '../../../hooks/useSort';

export type CoinSortKey =
  | 'market_cap_rank'
  | 'name'
  | 'current_price'
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_24h_in_currency'
  | 'price_change_percentage_7d_in_currency'
  | 'market_cap'
  | 'total_volume';

interface ColumnDef {
  key: CoinSortKey;
  label: string;
  align: 'left' | 'right';
  srOnly?: boolean;
}

const COLUMNS: ColumnDef[] = [
  { key: 'market_cap_rank', label: '#', align: 'left' },
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'current_price', label: 'Price', align: 'right' },
  {
    key: 'price_change_percentage_1h_in_currency',
    label: '1h %',
    align: 'right',
  },
  {
    key: 'price_change_percentage_24h_in_currency',
    label: '24h %',
    align: 'right',
  },
  {
    key: 'price_change_percentage_7d_in_currency',
    label: '7d %',
    align: 'right',
  },
  { key: 'market_cap', label: 'Market Cap', align: 'right' },
  { key: 'total_volume', label: 'Volume (24h)', align: 'right' },
];

interface CoinsTableProps {
  coins: CoinMarket[];
  sortKey: CoinSortKey;
  direction: SortDirection;
  onToggleSort: (key: CoinSortKey) => void;
}

function ariaSortFor(
  active: boolean,
  direction: SortDirection,
): 'ascending' | 'descending' | 'none' {
  if (!active) return 'none';
  return direction === 'asc' ? 'ascending' : 'descending';
}

export function CoinsTable({
  coins,
  sortKey,
  direction,
  onToggleSort,
}: CoinsTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th scope="col" className="w-10 px-3 py-2">
              <span className="sr-only">Favorite</span>
            </th>
            {COLUMNS.map((col) => {
              const active = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSortFor(active, direction)}
                  className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    <span>{col.label}</span>
                    {active && (
                      <span aria-hidden="true">
                        {direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <CoinRow key={coin.id} coin={coin} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
