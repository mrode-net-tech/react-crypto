import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, fetchJson } from '../apiClient';

const BASE = import.meta.env.VITE_API_BASE_URL;

describe('fetchJson', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds URL with query params and resolves JSON on 2xx', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    const result = await fetchJson<{ ok: boolean }>('/coins/markets', {
      vs_currency: 'usd',
      page: 2,
      sparkline: false,
    });

    expect(result).toEqual({ ok: true });
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain(`${BASE}/coins/markets`);
    expect(calledUrl).toContain('vs_currency=usd');
    expect(calledUrl).toContain('page=2');
    expect(calledUrl).toContain('sparkline=false');
  });

  it('skips undefined params', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(
      new Response('{}', { status: 200 }),
    );

    await fetchJson('/coins/markets', { vs_currency: 'usd', category: undefined });

    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).not.toContain('category');
  });

  it('throws ApiError with status on non-2xx response', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response('rate limited', { status: 429, statusText: 'Too Many' }),
    );

    await expect(fetchJson('/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 429,
    });
  });

  it('wraps network failures into ApiError with status 0', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new TypeError('boom'));

    const error = await fetchJson('/x').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
  });
});
