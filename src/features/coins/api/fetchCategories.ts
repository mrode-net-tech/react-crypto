import { fetchJson } from '../../../lib/apiClient';
import type { CoinCategory } from '../../../types/coingecko';

/** `GET /coins/categories/list` — flat list of category ids and names. */
export function fetchCategories(): Promise<CoinCategory[]> {
  return fetchJson<CoinCategory[]>('/coins/categories/list');
}
