# API

This project consumes the public **CoinGecko REST API**.

- Base URL: `https://api.coingecko.com/api/v3`
- Official documentation: <https://docs.coingecko.com/reference/introduction>
- Endpoint reference: <https://docs.coingecko.com/reference/endpoint-overview>

The free public tier is rate-limited. We mitigate it with:

- sensible `staleTime` values in TanStack Query,
- a single `refetchInterval` (60s) for live updates on the coins list,
- `placeholderData: keepPreviousData` so re-renders don't trigger re-fetches.

During development we also use the official **CoinGecko MCP server**
(configured in `.mcp.json`) so the AI assistant can query the API directly
while we work.

## Endpoints used

### `GET /coins/markets`

Paginated list of coins with market data — powers the main coins table.

Query params we use:

- `vs_currency=usd`
- `order=market_cap_desc`
- `per_page=100`
- `page=1`
- `sparkline=false`
- `price_change_percentage=1h,24h,7d`

### `GET /coins/{id}`

Detailed information about a single coin — powers `CoinDetailsPage`
(name, symbol, description, market data, links).

### `GET /coins/{id}/market_chart`

Historical price/volume series — powers the Recharts price chart on the detail
page.

Query params we use:

- `vs_currency=usd`
- `days=1 | 7 | 30 | 365` (driven by the chart range selector)

## Types

TypeScript shapes for these responses live in `src/types/coingecko.ts` and are
imported by `features/coins/api/*` and the related hooks. Never inline a
CoinGecko response shape in a component.
