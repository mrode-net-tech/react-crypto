import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { useFavorites } from '../FavoritesContext';
import { FavoritesProvider } from '../FavoritesProvider';

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('FavoritesContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('starts empty when nothing is persisted', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites.size).toBe(0);
    expect(result.current.has('bitcoin')).toBe(false);
  });

  it('add / remove / toggle update the set', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => result.current.add('bitcoin'));
    expect(result.current.has('bitcoin')).toBe(true);

    act(() => result.current.toggle('ethereum'));
    expect(result.current.has('ethereum')).toBe(true);

    act(() => result.current.toggle('bitcoin'));
    expect(result.current.has('bitcoin')).toBe(false);

    act(() => result.current.remove('ethereum'));
    expect(result.current.favorites.size).toBe(0);
  });

  it('persists to localStorage and rehydrates on next mount', () => {
    const first = renderHook(() => useFavorites(), { wrapper });
    act(() => first.result.current.add('solana'));

    const stored = JSON.parse(window.localStorage.getItem('favorites') ?? '[]');
    expect(stored).toEqual(['solana']);

    first.unmount();
    const second = renderHook(() => useFavorites(), { wrapper });
    expect(second.result.current.has('solana')).toBe(true);
  });

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useFavorites())).toThrow(
      /must be used inside/i,
    );
  });
});
