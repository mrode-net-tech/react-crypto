# Project rules — react-crypto

You are working on **react-crypto**, a small **React 19 + TypeScript + Vite**
application that displays a crypto dashboard (data from CoinGecko). The user
is a beginner React/TS developer — keep things simple and explain non-obvious
choices.

Always read `docs/plan.md`, `docs/architecture.md`, and `docs/api.md` before
making non-trivial changes. They are the source of truth.

## Stack

- Vite 8 + React 19 + **TypeScript (strict)**
- Tailwind CSS v4 via `@tailwindcss/vite` (dark mode via `class` strategy)
- TanStack Query v5 for all server state
- React Router v7 for navigation
- Recharts for the price chart
- Vitest + React Testing Library for tests
- ESLint flat config + Prettier (`eslint-config-prettier` to avoid conflicts)

## Core principles

### KISS — Keep It Simple, Stupid

- Pick the simplest solution that works.
- Don't introduce abstractions until there's a real second use case.
- No premature optimization, no speculative configuration.
- Don't add new dependencies without asking the user first.

### DRY — Don't Repeat Yourself

- If the same JSX or logic appears twice, extract it (small component / util /
  hook).
- Shared formatters in `lib/formatters.ts`, shared constants in
  `lib/constants.ts`, shared types in `src/types/`.

### SRP — Single Responsibility

- One component / hook / function does one thing.
- If a file grows past ~150 lines or mixes concerns, split it.

### Separation of concerns

- **UI** (components) ≠ **logic** (custom hooks) ≠ **data access** (`features/*/api`).
- Components don't call `fetch` directly — they call hooks.
- Hooks don't build URLs by hand — they call `api/` functions.
- `api/` functions don't import React.

### Composition over configuration

- Prefer `children` and slot-like props over a long list of boolean props.

## TypeScript rules

- `strict: true` everywhere. Don't weaken `tsconfig`.
- **Never use `any`.** Use `unknown` + narrowing if the type is genuinely
  unknown. Don't disable `@typescript-eslint/no-explicit-any`.
- Type all component props with `interface` (extendable) or `type`
  (unions / aliases). No untyped props.
- Type API responses in `src/types/coingecko.ts`. Never inline a CoinGecko
  response shape in a component.
- Use **generics** for reusable hooks/components (e.g. `useSort<T>`).
- Prefer `import type { ... }` for type-only imports.
- Strict null checks: handle `undefined` explicitly, don't `!`-assert away
  problems.

## Conventions

### Naming

- Components: `PascalCase.tsx` (e.g. `CoinsTable.tsx`).
- Hooks: `useCamelCase.ts`, must start with `use`.
- Utilities: `camelCase.ts`.
- Types: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.

### React

- Stable keys in lists — IDs from data, never the array index.
- Semantic HTML: `<table>`, `<button>`, `<a>` over generic `<div>`s.
- Basic a11y: `aria-label` on icon-only controls, `aria-sort` on sortable
  headers, visible focus states.
- No magic values — extract to `lib/constants.ts` or env vars.
- `React.memo` only on rows / cells rendered many times. Don't memo everything.

### TanStack Query

- All query keys in `lib/queryKeys.ts` (typed factory).
- Fetch functions live in `features/<feature>/api/`, free of React.
- Wrapping hooks live in `features/<feature>/hooks/`.
- Sensible `staleTime` (~60s) on every query.
- `refetchInterval: 60_000` only where the "live" requirement applies
  (coins list).
- `placeholderData: keepPreviousData` for paginated / dependent queries.

### Styling & theme

- Tailwind utilities first. If a class combination repeats, promote to a
  component in `components/`.
- Dark mode is `class`-based — toggle `<html class="dark">` via
  `ThemeContext`. Use `dark:` variants in markup; don't branch on theme in JS.
- No inline `style={...}` unless the value is dynamic and unavoidable.

### Files & env

- HTTP base URL comes from `VITE_API_BASE_URL` (`.env`). Never hardcode.
- Vite only exposes `VITE_*` variables. Don't use other prefixes.
- `.env` is gitignored; `.env.example` is committed.

### Comments

- Comment the **why**, not the **what**. Code should read by itself.

### Testing

- Vitest (`jsdom`) + React Testing Library + `@testing-library/jest-dom`
  - `@testing-library/user-event`.
- Co-locate tests: `Foo.tsx` next to `Foo.test.tsx`.
- Test behavior, not implementation details.

## Folder structure

See `docs/architecture.md`. Always place new files in the layer that matches
their responsibility — don't create new top-level folders without discussing it.

## Formatting

- **Prettier** is the single source of truth for formatting. Don't hand-format
  or argue with it.
- ESLint handles correctness only; `eslint-config-prettier` disables rules
  that conflict with Prettier. Don't add stylistic ESLint rules back.
- Run `npm run format` before committing (or rely on `format:check` in CI
  later).

## Commits

- Use **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`,
  `refactor:`, `style:`, `test:`, `perf:`, `build:`, `ci:`).
- Use the `/commit` slash command to generate messages from staged changes.

## When in doubt

- Ask the user before adding a new dependency.
- Ask before creating a new top-level folder or restructuring existing code.
- Prefer the boring, well-documented solution over the clever one.
