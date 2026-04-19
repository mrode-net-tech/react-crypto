import { useEffect } from 'react';

const BASE = 'Crypto Coins';

/**
 * Sets `document.title` while mounted and restores the previous value on
 * unmount. Improves UX (browser tab) and a11y — screen readers announce
 * the new title on route change.
 */
export function useDocumentTitle(title: string | undefined): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
