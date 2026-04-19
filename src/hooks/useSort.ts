import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K;
  direction: SortDirection;
}

export interface UseSortResult<T, K extends string> {
  sorted: T[];
  sortKey: K;
  direction: SortDirection;
  toggleSort: (key: K) => void;
}

/**
 * Generic in-memory sort. Caller provides an `accessor` that returns the
 * sortable primitive for a given (item, key). Nullish values are pushed
 * to the bottom regardless of direction.
 *
 * `useMemo` keeps the sorted array stable as long as inputs don't change,
 * so memoized rows below it don't re-render needlessly.
 */
export function useSort<T, K extends string>(
  items: T[],
  initial: SortState<K>,
  accessor: (item: T, key: K) => number | string | null | undefined,
): UseSortResult<T, K> {
  const [state, setState] = useState<SortState<K>>(initial);

  const toggleSort = useCallback((key: K) => {
    setState((prev) => {
      if (prev.key !== key) return { key, direction: 'desc' };
      return {
        key,
        direction: prev.direction === 'desc' ? 'asc' : 'desc',
      };
    });
  }, []);

  const sorted = useMemo(() => {
    const copy = [...items];
    const { key, direction } = state;
    const dir = direction === 'asc' ? 1 : -1;

    copy.sort((a, b) => {
      const av = accessor(a, key);
      const bv = accessor(b, key);
      const aNull = av == null;
      const bNull = bv == null;
      if (aNull && bNull) return 0;
      if (aNull) return 1;
      if (bNull) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return copy;
  }, [items, state, accessor]);

  return {
    sorted,
    sortKey: state.key,
    direction: state.direction,
    toggleSort,
  };
}
