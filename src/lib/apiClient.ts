/*
  Tiny typed wrapper around `fetch` for the CoinGecko REST API.

  Why a wrapper at all (KISS check):
  - One place owns the base URL (env-driven), URL building, and error mapping.
  - Hooks can call `fetchJson<T>('/coins/markets', { ... })` and just get
    back a typed payload — no `any`, no string concatenation, no boilerplate.

  No runtime validation here on purpose: CoinGecko's response is described in
  src/types/coingecko.ts and we trust it. If we ever start mistrusting the
  API, swap this for zod in one place — the call sites won't change.
*/

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Copy .env.example to .env and restart Vite.',
  );
}

export type QueryParamPrimitive = string | number | boolean;

/** Thrown for any non-2xx response so callers can branch on `instanceof`. */
export class ApiError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
  }
}

function buildUrl(
  path: string,
  params?: Record<string, QueryParamPrimitive | undefined>,
): string {
  // Strip trailing slash on base / leading slash on path so joining is safe.
  const url = new URL(
    path.replace(/^\//, ''),
    BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`,
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function fetchJson<T>(
  path: string,
  params?: Record<string, QueryParamPrimitive | undefined>,
  init?: RequestInit,
): Promise<T> {
  const url = buildUrl(path, params);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(`Network error while requesting ${url}`, 0, url);
  }

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
      url,
    );
  }

  return (await response.json()) as T;
}
