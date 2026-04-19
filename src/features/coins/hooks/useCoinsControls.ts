import { useCallback, useState } from 'react';
import type { CoinsOrder } from '../../../types/coingecko';

export interface CoinsControlsState {
  page: number;
  order: CoinsOrder;
  category: string | null;
  favoritesOnly: boolean;
}

const INITIAL: CoinsControlsState = {
  page: 1,
  order: 'market_cap_desc',
  category: null,
  favoritesOnly: false,
};

export interface UseCoinsControlsResult {
  state: CoinsControlsState;
  setOrder: (order: CoinsOrder) => void;
  setCategory: (id: string | null) => void;
  setPage: (updater: number | ((prev: number) => number)) => void;
  setFavoritesOnly: (v: boolean) => void;
  reset: () => void;
}

/**
 * UI state for the coins list controls. `order` and `category` are sent
 * to the API; `page` drives pagination; `favoritesOnly` is a client-only
 * view filter applied after fetch. Changing `order` or `category` resets
 * `page` to 1 to avoid landing on an empty page.
 */
export function useCoinsControls(): UseCoinsControlsResult {
  const [state, setState] = useState<CoinsControlsState>(INITIAL);

  const setOrder = useCallback((order: CoinsOrder) => {
    setState((prev) => ({ ...prev, order, page: 1 }));
  }, []);

  const setCategory = useCallback((category: string | null) => {
    setState((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const setPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setState((prev) => ({
        ...prev,
        page:
          typeof updater === 'function'
            ? Math.max(1, updater(prev.page))
            : Math.max(1, updater),
      }));
    },
    [],
  );

  const setFavoritesOnly = useCallback((favoritesOnly: boolean) => {
    setState((prev) => ({ ...prev, favoritesOnly }));
  }, []);

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, setOrder, setCategory, setPage, setFavoritesOnly, reset };
}
