import { memo, useCallback } from 'react';
import { useFavorites } from '../../../contexts/favorites';

interface FavoriteButtonProps {
  coinId: string;
  coinName: string;
}

function FavoriteButtonBase({ coinId, coinName }: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const isFavorite = has(coinId);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      // Stop the parent <Link> on the row from navigating to /coin/:id.
      e.stopPropagation();
      e.preventDefault();
      toggle(coinId);
    },
    [coinId, toggle],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isFavorite
          ? `Remove ${coinName} from favorites`
          : `Add ${coinName} to favorites`
      }
      aria-pressed={isFavorite}
      className="inline-flex h-7 w-7 items-center justify-center rounded text-lg leading-none text-slate-400 transition hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400"
    >
      <span aria-hidden="true">
        {isFavorite ? (
          <span className="text-amber-500">★</span>
        ) : (
          <span>☆</span>
        )}
      </span>
    </button>
  );
}

export const FavoriteButton = memo(FavoriteButtonBase);
