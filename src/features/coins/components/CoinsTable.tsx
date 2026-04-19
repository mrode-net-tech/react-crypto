import type { CoinMarket, CoinsOrder } from '../../../types/coingecko';
import { CoinRow } from './CoinRow';

interface ColumnDef {
  label: string;
  align: 'left' | 'right';
  /** Map this column to a CoinGecko `order` pair. Omit if not server-sortable. */
  sort?: { asc: CoinsOrder; desc: CoinsOrder };
}

const COLUMNS: ColumnDef[] = [
  {
    label: '#',
    align: 'left',
    sort: { asc: 'market_cap_desc', desc: 'market_cap_asc' },
  },
  { label: 'Name', align: 'left', sort: { asc: 'id_asc', desc: 'id_desc' } },
  { label: 'Price', align: 'right' },
  { label: '1h %', align: 'right' },
  { label: '24h %', align: 'right' },
  { label: '7d %', align: 'right' },
  {
    label: 'Market Cap',
    align: 'right',
    sort: { asc: 'market_cap_asc', desc: 'market_cap_desc' },
  },
  {
    label: 'Volume (24h)',
    align: 'right',
    sort: { asc: 'volume_asc', desc: 'volume_desc' },
  },
];

interface CoinsTableProps {
  coins: CoinMarket[];
  order: CoinsOrder;
  /** When omitted, headers render as plain labels (no sort affordance). */
  onChangeOrder?: (order: CoinsOrder) => void;
}

function ariaSortFor(
  col: ColumnDef,
  order: CoinsOrder,
): 'ascending' | 'descending' | 'none' {
  if (!col.sort) return 'none';
  if (order === col.sort.asc) return 'ascending';
  if (order === col.sort.desc) return 'descending';
  return 'none';
}

function nextOrder(col: ColumnDef, order: CoinsOrder): CoinsOrder | null {
  if (!col.sort) return null;
  return order === col.sort.desc ? col.sort.asc : col.sort.desc;
}

export function CoinsTable({ coins, order, onChangeOrder }: CoinsTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th scope="col" className="w-10 px-3 py-2">
              <span className="sr-only">Favorite</span>
            </th>
            {COLUMNS.map((col) => {
              const sortState = ariaSortFor(col, order);
              const sortable = Boolean(col.sort) && Boolean(onChangeOrder);
              return (
                <th
                  key={col.label}
                  scope="col"
                  aria-sort={sortState}
                  className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => {
                        const next = nextOrder(col, order);
                        if (next) onChangeOrder?.(next);
                      }}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <span>{col.label}</span>
                      {sortState !== 'none' && (
                        <span aria-hidden="true">
                          {sortState === 'ascending' ? '▲' : '▼'}
                        </span>
                      )}
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
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
