import { createContext, useContext } from 'react';

export interface FavoritesContextValue {
  favorites: ReadonlySet<string>;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>.');
  }
  return ctx;
}
