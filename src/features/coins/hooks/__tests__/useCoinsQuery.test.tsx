import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useCoinsQuery } from '../useCoinsQuery';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useCoinsQuery', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hits /coins/markets with paging params and resolves data', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: 'bitcoin' }]), { status: 200 }),
    );

    const { result } = renderHook(
      () => useCoinsQuery({ page: 2, order: 'volume_desc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'bitcoin' }]);

    const url = fetchMock.mock.calls[0]?.[0] as string;
    expect(url).toContain('/coins/markets');
    expect(url).toContain('page=2');
    expect(url).toContain('order=volume_desc');
    expect(url).toContain('per_page=');
  });

  it('forwards the category param when provided', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(new Response('[]', { status: 200 }));

    const { result } = renderHook(
      () => useCoinsQuery({ category: 'decentralized-finance-defi' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const url = fetchMock.mock.calls[0]?.[0] as string;
    expect(url).toContain('category=decentralized-finance-defi');
  });

  it('surfaces ApiError as isError', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response('boom', { status: 500, statusText: 'Server Error' }),
    );

    const { result } = renderHook(() => useCoinsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
