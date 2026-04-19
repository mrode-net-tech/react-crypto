# Crypto Coins

A small CoinGecko-inspired dashboard built with **React 19 + TypeScript +
Vite + TanStack Query**. Lists the top cryptocurrencies, supports
server-side filtering / sorting / pagination, lets the user star
favorites (persisted in `localStorage`), and shows a per-coin details
view with a Recharts price chart.

> Built as a learning project — emphasis on a typed data layer, a
> sensible folder structure (feature-first), and a small but real test
> suite.

## Stack

| Concern            | Choice                                                 |
| ------------------ | ------------------------------------------------------ |
| UI                 | React 19, React Router v7                              |
| Language           | TypeScript (strict, `noUncheckedIndexedAccess`)        |
| Styling            | Tailwind CSS v4 (with dark mode via `@custom-variant`) |
| Data fetching      | TanStack Query v5                                      |
| Charts             | Recharts (lazy-loaded with the details page)           |
| HTML sanitization  | DOMPurify (CoinGecko description HTML)                 |
| Build / dev server | Vite 8                                                 |
| Tests              | Vitest + Testing Library + jest-dom                    |
| Lint / format      | ESLint 9 + Prettier 3                                  |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure the API base URL
cp .env.example .env
# (defaults to https://api.coingecko.com/api/v3)

# 3. Run the dev server
npm run dev

# 4. Visit http://localhost:5173
```

### Scripts

| Script                 | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Vite dev server with HMR                      |
| `npm run build`        | `tsc -b` + production Vite build into `dist/` |
| `npm run preview`      | Serve the built bundle locally                |
| `npm run lint`         | ESLint over the whole repo                    |
| `npm run format`       | Prettier write                                |
| `npm run format:check` | Prettier check (CI)                           |
| `npm test`             | Run the Vitest suite once (CI mode)           |
| `npm run test:watch`   | Vitest in watch mode                          |

## Environment

`.env.example` lists every variable that the app reads via
`import.meta.env`. Only `VITE_`-prefixed names are exposed by Vite at
build time.

```env
VITE_API_BASE_URL=https://api.coingecko.com/api/v3
```

If the variable is missing the app fails fast at startup
(`src/lib/apiClient.ts`) with a descriptive error — no silent
misconfiguration.

## API

We hit a small slice of the public CoinGecko REST API. See `docs/api.md`
for the full list of endpoints and parameters used.

| Endpoint                       | Used by                        |
| ------------------------------ | ------------------------------ |
| `GET /coins/markets`           | List view + favorites (`ids=`) |
| `GET /coins/categories/list`   | Category dropdown              |
| `GET /coins/{id}`              | Details page                   |
| `GET /coins/{id}/market_chart` | Price chart                    |

### Filtering, sorting and pagination

The list view intentionally exposes **only** the controls that the
`/coins/markets` endpoint actually supports:

- **Category** (server-side, `?category=`)
- **Sort** (server-side, `?order=`) — applied to `#`, `Name`, `Market
  Cap`, and `Volume`. Price and percentage-change columns are not
  sortable because the API offers no matching `order` value.
- **Pagination** — Prev/Next; Next disables when the page returned fewer
  than `per_page` rows (CoinGecko doesn't return a total count).
- **Favorites only** — the only client-side toggle. When enabled, the
  app fetches `?ids=<csv>` so favorites from any market-cap rank are
  visible in a single response.

We deliberately skipped client-side text search / price ranges /
gainers-losers, since they would only filter the visible page and
mislead the user.

## Project layout

```
src/
  app/                # router, root layout, query client wiring
  components/         # shared UI (Spinner, ErrorState, Pagination, ThemeToggle)
  config/             # typed runtime constants (refresh intervals, defaults)
  contexts/           # ThemeProvider, FavoritesProvider (folder per context)
  features/coins/     # everything coins-related
    api/              # fetchers (one per endpoint)
    components/       # CoinsTable, CoinRow, CoinFilters, PriceChart, …
    hooks/            # useCoinsQuery, useFavoriteCoinsQuery, useCoinsControls, …
    pages/            # CoinsListPage, CoinDetailsPage
  hooks/              # cross-cutting hooks (useDocumentTitle)
  lib/                # apiClient, formatters, queryKeys
  types/              # CoinGecko response types (only what we use)
  styles/             # global Tailwind entry
  test/               # Vitest setup
```

Test files live in `__tests__/` folders co-located with the code they
exercise.

## Theming

Tailwind v4 dark mode is gated by a custom variant
(`@custom-variant dark (&:where(.dark, .dark *))`) so the toggle just
flips a `.dark` class on `<html>`. The user's choice is persisted in
`localStorage` and the initial value falls back to the OS preference
(`prefers-color-scheme`).

## Accessibility notes

- Skip-to-main-content link as the first focusable element.
- All buttons have visible `:focus-visible` rings and `aria-label` /
  `aria-pressed` where icons replace text.
- Loading uses `role="status"` with `aria-live="polite"`; errors use
  `role="alert"`.
- Sort headers use `aria-sort`; chart range tabs use `role="tab"` /
  `aria-selected`.
- `document.title` updates per route via `useDocumentTitle` so screen
  readers announce navigation.
- Color contrast verified in both themes (Tailwind slate / emerald /
  rose palettes at the ranges used).

## MCP

`.mcp.json` configures the CoinGecko MCP server so editor tools can
introspect the API at design time. It is purely a developer
convenience — the running app uses `fetch` against `VITE_API_BASE_URL`.
