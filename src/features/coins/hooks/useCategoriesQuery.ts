import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/fetchCategories';
import { queryKeys } from '../../../lib/queryKeys';

/**
 * Categories barely change — long staleTime so we don't waste rate
 * limit on a list that's effectively static during a session.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.coins.categories,
    queryFn: fetchCategories,
    staleTime: 60 * 60_000,
  });
}
