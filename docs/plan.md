# Work Plan — react-crypto

## Goal

A small **Crypto Dashboard** (inspired by coingecko.com) built with **React 19 +
TypeScript + Vite**, **TanStack Query** for data fetching and **Recharts** for
charts. The core deliverable is a rich coins table (filter / sort / paginate or
virtualize 100+ rows) plus a per-coin details view. Data: **CoinGecko REST API**
(free tier), with the official **CoinGecko MCP server** available to the AI
during development.

This is the **second iteration** of the project. The previous one was JavaScript
and is being rebuilt from the Vite scaffold using **TypeScript** end-to-end.

## Product decisions

- Default currency: **USD**.
- Initial dataset: **100 coins** (CoinGecko `per_page=100`).
- Table behavior: **sortable columns** + **filters** (price range, market cap,
  volume, gainers/losers).
- **Detail view** per coin with stats and a **Recharts** price chart
  (1d / 7d / 30d / 1y range selector).
- **Auto-refresh** every 60s (TanStack Query `refetchInterval`).
- **Dark mode** with persisted preference (Tailwind v4 dark variant + Context).
- **Favorites** persisted in `localStorage` (Context).
- Linting: **ESLint** flat config (already in place).
- Formatting: **Prettier** (with `eslint-config-prettier` so ESLint and Prettier
  don't fight). Project-wide config + `format` / `format:check` scripts.
- Testing: **Vitest + React Testing Library**.

## Stack

- **Vite 8**, **React 19**, **TypeScript** (strict).
- **Tailwind CSS v4** via `@tailwindcss/vite` (dark mode via `class` strategy).
- **TanStack Query v5** + devtools.
- **React Router v7** (`react-router-dom`).
- **Recharts** for the price chart.
- **@tanstack/react-virtual** for virtualized rows (only if the table feels
  sluggish; introduce when there's a real reason — KISS).
- **Vitest + @testing-library/react + @testing-library/user-event + jsdom**.
- **Prettier** + `eslint-config-prettier`.

## TypeScript ground rules

- `strict: true` (incl. `noImplicitAny`, `strictNullChecks`).
- **Never** use `any`. Use `unknown` + narrowing if a type is genuinely unknown.
- Type all component props with `interface` (or `type` for unions/aliases).
- Type CoinGecko responses in `src/types/` and import them everywhere.
- Use **generics** for reusable hooks/components (e.g. `useSort<T>`).
- Prefer `import type { ... }` for type-only imports.

## Folder structure

See `docs/architecture.md`.

## Todos (execution order)

### Phase 0 — config & cleanup ✅

- [x] `cleanup-template` — remove Vite/React boilerplate (`App.tsx`, `App.css`,
      demo assets) so we start from a clean slate.
- [x] `folder-structure` — create `src/{app,components,contexts,features/coins/{api,hooks,components,pages},hooks,lib,styles,types,test}`.
- [x] `env-setup` — confirm `.env` with `VITE_API_BASE_URL=https://api.coingecko.com/api/v3`
      (fix `.env.example` to use the `VITE_` prefix so Vite exposes it).
- [x] `tailwind-darkmode` — configure Tailwind v4 dark mode (`class` strategy) and
      do a utility smoke test.
- [x] `ts-strict-verify` — confirm `tsconfig.app.json` has `strict: true` and the
      React 19 / Vite types resolve.

### Phase 1 — deps & infrastructure ✅

- [x] `deps-runtime` — `npm i @tanstack/react-query @tanstack/react-query-devtools
react-router-dom recharts`.
- [x] `deps-test` — `npm i -D vitest @testing-library/react @testing-library/jest-dom
@testing-library/user-event jsdom`.
- [x] `prettier-setup` — `npm i -D prettier eslint-config-prettier`, add
      `.prettierrc.json` + `.prettierignore`, append `prettier` to the ESLint flat
      config `extends`, and add `format` / `format:check` scripts in
      `package.json`.
- [x] `query-client-setup` — `src/app/queryClient.ts` with sensible defaults
      (`staleTime`, `refetchInterval` per-query, `placeholderData: keepPreviousData`).
- [x] `router-setup` — `src/app/router.tsx` with `/` and `/coin/:id` + shared layout.
- [x] `providers-wireup` — `src/main.tsx` mounts `<QueryClientProvider>`,
      `<RouterProvider>`, devtools. _ThemeProvider/FavoritesProvider plug in
      during Phase 3 once those contexts exist._

### Phase 2 — typed data layer ✅

- [x] `types-coingecko` — `src/types/coingecko.ts` (`CoinMarket`, `CoinDetails`,
      `MarketChartPoint`, query params).
- [x] `api-client` — `src/lib/apiClient.ts` (typed `fetchJson<T>(path, params?)`,
      baseURL from env, error handling, no `any`).
- [x] `query-keys` — `src/lib/queryKeys.ts` factory
      (`coins.list({page,currency,...})`, `coins.detail(id)`, `coins.chart(id, days)`).
- [x] `coins-api` — `features/coins/api/fetchCoins.ts` (`/coins/markets`,
      `per_page=100`, `vs_currency=usd`, `sparkline=false`, `price_change_percentage`).
- [x] `coin-api` — `features/coins/api/fetchCoinById.ts` (`/coins/{id}`).
- [x] `chart-api` — `features/coins/api/fetchCoinMarketChart.ts`
      (`/coins/{id}/market_chart`, `days` param).
- [x] `use-coins-query` — `features/coins/hooks/useCoinsQuery.ts`
      (`refetchInterval: 60_000`, `staleTime: 60_000`).
- [x] `use-coin-query` — `features/coins/hooks/useCoinQuery.ts`.
- [x] `use-market-chart-query` — `features/coins/hooks/useMarketChartQuery.ts`.

### Phase 3 — contexts ✅

- [x] `theme-context` — `contexts/ThemeContext.tsx` (`light` | `dark`,
      `localStorage`, system preference fallback).
- [x] `favorites-context` — `contexts/FavoritesContext.tsx` (`Set<string>` of coin
      IDs, `add` / `remove` / `toggle` / `has`, `localStorage`).
- [x] `theme-toggle` — `components/ThemeToggle.tsx` (icon button, `aria-label`).

### Phase 4 — table UI ✅

- [x] `formatters` — `lib/formatters.ts` (`formatPrice`, `formatPercent`,
      `formatMarketCap`, `formatVolume`).
- [x] `shared-ui` — `components/Spinner.tsx`, `components/ErrorState.tsx`
      (Pagination skipped — single page of 100 coins, not needed).
- [x] `price-change` — `features/coins/components/PriceChange.tsx` (color + sign,
      wrapped in `React.memo`).
- [x] `favorite-button` — `features/coins/components/FavoriteButton.tsx`.
- [x] `coin-row` — `features/coins/components/CoinRow.tsx` (`React.memo`, link to
      `/coin/:id`).
- [x] `use-sort-hook` — `hooks/useSort.ts` — generic `useSort<T>` returning sorted
      array + active key/direction (memoized with `useMemo`).
- [x] `use-coin-filters-hook` — `features/coins/hooks/useCoinFilters.ts`
      (search, price range, market cap floor, volume floor, gainers/losers, favorites-only).
- [x] `coin-filters` — `features/coins/components/CoinFilters.tsx`.
- [x] `coins-table` — `features/coins/components/CoinsTable.tsx` (semantic table,
      sortable headers with `aria-sort`).
- [x] `coins-list-page` — `features/coins/pages/CoinsListPage.tsx` (compose hook +
      filters + sort + table + loading/error states).
- [ ] `virtualization` _(only if needed)_ — defer until measured.

### Phase 5 — details view (chart is required for this project, even though

the spec only mentions Recharts as part of the stack)

- `coin-details-page` — `features/coins/pages/CoinDetailsPage.tsx` (header,
  stats grid, sanitized description, embeds `PriceChart`).
- `price-chart` — `features/coins/components/PriceChart.tsx` (Recharts
  `LineChart` inside `ResponsiveContainer`, range selector 1/7/30/365, USD
  axis formatter, tooltip with formatted price + date). **Must be visible on
  the details page** — this is an explicit project requirement on top of the
  PDF spec.
- `back-navigation` — link/breadcrumb back to the list (preserve filters via
  URL params if practical).

### Phase 6 — testing

- `vitest-setup` — `vitest.config.ts` (jsdom env), `src/test/setup.ts`
  (`@testing-library/jest-dom`), update `package.json` scripts (`test`,
  `test:watch`).
- `test-formatters` — pure unit tests.
- `test-api-client` — mocked `fetch`, error path.
- `test-use-coins-query` — render hook with `QueryClientProvider`.
- `test-favorites-context` — add / remove / persist.
- `test-coin-filters` — RTL + `user-event`.
- `test-coin-row` — renders price change and favorite button correctly.

### Phase 7 — polish

- `responsive-a11y` — mobile-first review, focus states, `aria-*`, color
  contrast in both themes.
- `readme-update` — final README: stack, scripts, env, API, MCP, screenshots.

## Notes / open questions

- Pagination vs virtualization: ship sortable + filterable table over **100
  coins** first. Add virtualization (or pagination on top of `markets`) only if
  there's a measurable perf or UX issue.
- `.env.example` currently uses `CRYPTO_API_BASE_URL`; Vite only exposes
  variables prefixed with `VITE_`. Switch it to `VITE_API_BASE_URL` in
  `env-setup`.
- Keep `any` out of the codebase — ESLint rule `@typescript-eslint/no-explicit-any`
  is on by default in the recommended config; do not disable it.
