# Architecture

## Overview

`react-crypto` is a single-page **React 19 + TypeScript** application. It uses
**TanStack Query v5** for all server state (fetching, caching, auto-refresh)
and **React Router v7** for navigation between the coins list and a coin
details view. Styling is **Tailwind CSS v4**. Charts are rendered with
**Recharts**.

There is no global state manager. Server data lives in TanStack Query's cache;
ephemeral UI state (current sort, filter values, current chart range) lives in
URL search params or local React state. Two cross-cutting concerns —
**theme** and **favorites** — live in **Context**.

## High-level flow

```
UI component  ──uses──▶  custom hook (useXxxQuery)
                              │
                              ▼
                       TanStack Query cache
                              │
                              ▼
                  fetchXxx() in features/*/api  (typed)
                              │
                              ▼
                  apiClient (typed fetch wrapper)
                              │
                              ▼
                        CoinGecko REST API
```

## Folder structure (feature-based, TypeScript)

```
src/
  app/                       # composition: providers, router, query client
    queryClient.ts
    router.tsx
  components/                # shared, presentational UI (no business logic)
    Spinner.tsx
    ErrorState.tsx
    Pagination.tsx
    ThemeToggle.tsx
  contexts/
    ThemeContext.tsx
    FavoritesContext.tsx
  features/
    coins/
      api/                   # pure typed fetch functions, no React
        fetchCoins.ts
        fetchCoinById.ts
        fetchCoinMarketChart.ts
      hooks/                 # React hooks wrapping TanStack Query
        useCoinsQuery.ts
        useCoinQuery.ts
        useMarketChartQuery.ts
        useCoinFilters.ts
      components/            # coin-specific UI
        CoinsTable.tsx
        CoinRow.tsx
        CoinFilters.tsx
        PriceChange.tsx
        PriceChart.tsx
        FavoriteButton.tsx
      pages/                 # route-level components
        CoinsListPage.tsx
        CoinDetailsPage.tsx
  hooks/                     # cross-feature reusable hooks (generic)
    useSort.ts
    useDebounce.ts
  lib/                       # framework-agnostic helpers
    apiClient.ts
    queryKeys.ts
    formatters.ts
    constants.ts
  types/                     # shared types (CoinGecko DTOs, app-wide)
    coingecko.ts
  styles/
    index.css                # Tailwind entry
  test/
    setup.ts                 # @testing-library/jest-dom etc.
  main.tsx                   # entry: providers + <RouterProvider>
```

### Why feature-based?

Grouping by feature keeps related files close together; it scales naturally as
new features (e.g. portfolio, alerts) are added.

## Layer responsibilities

- **`app/`** — wiring only: providers, router, QueryClient. No UI.
- **`components/`** — generic, reusable UI building blocks. No data fetching.
- **`contexts/`** — cross-cutting state (theme, favorites). Provider + hook
  exported from the same file.
- **`features/<feature>/api/`** — pure typed `fetch` functions. No React,
  no hooks. Inputs typed; outputs typed via `src/types/`.
- **`features/<feature>/hooks/`** — React hooks wrapping `api/` calls in
  `useQuery`. The only place that touches TanStack Query for that feature.
- **`features/<feature>/components/`** — feature-specific UI. May call feature
  hooks and contexts.
- **`features/<feature>/pages/`** — route components. Compose hooks and
  components, handle loading/error states.
- **`hooks/`** — cross-feature reusable hooks (`useSort<T>`, `useDebounce`).
- **`lib/`** — pure utilities, no React.
- **`types/`** — shared DTOs / domain types.

## Data layer rules

- All HTTP calls go through `lib/apiClient.ts`:
  ```ts
  export async function fetchJson<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    /* ... */
  }
  ```
- Query keys are defined in `lib/queryKeys.ts` as a typed factory:
  ```ts
  export const queryKeys = {
    coins: {
      all: ['coins'] as const,
      list: (params: CoinsListParams) => ['coins', 'list', params] as const,
      detail: (id: string) => ['coins', 'detail', id] as const,
      chart: (id: string, days: number) =>
        ['coins', 'chart', id, days] as const,
    },
  } as const;
  ```
- Each `useXxxQuery` hook sets a sensible `staleTime` (default ~60s) and, where
  appropriate, `refetchInterval: 60_000` to satisfy the "live data" requirement
  without spamming the API.
- Paginated/sortable queries use `placeholderData: keepPreviousData` to avoid
  flicker.

## State strategy

- **Server data** → TanStack Query (single source of truth for coin data).
- **Ephemeral UI** (sort key, filter values, chart range) → URL search params
  when shareable, otherwise local `useState`.
- **Theme** → `ThemeContext` (persisted in `localStorage`).
- **Favorites** → `FavoritesContext` (persisted in `localStorage`).
- No Redux / Zustand. If a third Context appears, reconsider before adding it.

## Routing

- `/` → `CoinsListPage` (sortable + filterable coins table).
- `/coin/:id` → `CoinDetailsPage` (stats + Recharts chart with range selector).
- Shared layout component wraps both routes (header, theme toggle, container).

## Styling & theming

- Tailwind CSS v4 via `@tailwindcss/vite`. Entry: `src/styles/index.css`.
- Dark mode via the **`class` strategy**: `<html class="dark">` toggled by
  `ThemeContext`. Use `dark:` variants in markup; don't branch on theme in JS.
- Reuse Tailwind utilities; promote repeated class combinations into small
  components in `components/` (DRY).

## Charts

- **Recharts** `<ResponsiveContainer><LineChart>...</LineChart></ResponsiveContainer>`.
- Data comes from `useMarketChartQuery(id, days)`; the component is presentational.
- Range selector (`1 / 7 / 30 / 365`) lives next to the chart and drives the
  `days` prop.
- The chart is **rendered on the coin details page** as a first-class part of
  the view (not behind a toggle). Recharts is part of the required stack and
  the user explicitly wants the chart visible.

## Performance

- Memoize heavy derivations with `useMemo` (sorted/filtered list).
- Memoize handler props passed to memoized children with `useCallback`.
- `React.memo` on `CoinRow` and `PriceChange` (rendered up to 100× per page).
- **Virtualization** (`@tanstack/react-virtual`) is _optional_ — add only if
  100 rows actually feel slow. Don't add the dependency speculatively.

## Formatting

- **Prettier** owns formatting; ESLint owns correctness.
- `eslint-config-prettier` is added to the flat-config `extends` so the two
  tools don't conflict.
- Config: `.prettierrc.json` at the repo root; `.prettierignore` mirrors
  `.gitignore` plus `package-lock.json` and `dist/`.
- Scripts: `npm run format` (write) and `npm run format:check` (CI-friendly).

## Conventions

- **Naming:** components `PascalCase.tsx`, hooks `useCamelCase.ts`, utilities
  `camelCase.ts`, types `PascalCase`, constants `UPPER_SNAKE_CASE`.
- **Single Responsibility:** if a file does more than one thing, split it.
- **Composition over configuration:** prefer `children`/slot props over many
  boolean props.
- **Stable keys** in lists — IDs from data, never the array index.
- **Semantic HTML** + a11y basics (`<table>`, `<button>`, `aria-label`,
  `aria-sort`, visible focus styles).
- **No magic values:** constants in `lib/constants.ts`, env vars in `.env`.
- **Comments** explain "why", not "what".

## TypeScript rules

- `strict: true` end-to-end. No `any` (use `unknown` + narrowing).
- Prop types via `interface` (extendable), unions/aliases via `type`.
- API DTOs typed in `src/types/coingecko.ts`; never inline a CoinGecko shape.
- Generics for reusable hooks/components (`useSort<T>`, sortable table column
  config).
- `import type { ... }` for type-only imports.

## Environment variables

- `VITE_API_BASE_URL` — base URL for CoinGecko API
  (`https://api.coingecko.com/api/v3`). Vite exposes only `VITE_*`.
- `.env` is gitignored; `.env.example` is committed.

## Testing

- **Vitest** (`jsdom`) + **React Testing Library** + `@testing-library/jest-dom`
  - `@testing-library/user-event`.
- Cover: formatters, `apiClient` (mocked `fetch`), `useCoinsQuery` (with a test
  `QueryClientProvider`), `FavoritesContext`, `CoinFilters`, `CoinRow`.
- Keep tests close to the code (`*.test.ts` / `*.test.tsx` next to the file).
