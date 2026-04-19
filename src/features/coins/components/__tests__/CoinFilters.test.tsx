import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoinFilters } from '../CoinFilters';
import type { CoinsControlsState } from '../../hooks/useCoinsControls';

vi.mock('../../hooks/useCategoriesQuery', () => ({
  useCategoriesQuery: () => ({
    data: [
      { category_id: 'defi', name: 'DeFi' },
      { category_id: 'ai', name: 'Artificial Intelligence' },
    ],
    isPending: false,
  }),
}));

const baseState: CoinsControlsState = {
  page: 1,
  order: 'market_cap_desc',
  category: null,
  favoritesOnly: false,
};

describe('CoinFilters', () => {
  const setCategory = vi.fn<(id: string | null) => void>();
  const setFavoritesOnly = vi.fn<(v: boolean) => void>();
  const reset = vi.fn<() => void>();

  beforeEach(() => {
    setCategory.mockReset();
    setFavoritesOnly.mockReset();
    reset.mockReset();
  });

  afterEach(() => vi.clearAllMocks());

  it('renders categories sorted alphabetically with "All" first', () => {
    render(
      <CoinFilters
        state={baseState}
        setCategory={setCategory}
        setFavoritesOnly={setFavoritesOnly}
        reset={reset}
      />,
    );

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((o) => o.textContent);
    expect(optionLabels).toEqual([
      'All categories',
      'Artificial Intelligence',
      'DeFi',
    ]);
  });

  it('calls setCategory with id (or null for "All")', async () => {
    const user = userEvent.setup();
    render(
      <CoinFilters
        state={baseState}
        setCategory={setCategory}
        setFavoritesOnly={setFavoritesOnly}
        reset={reset}
      />,
    );

    await user.selectOptions(screen.getByLabelText(/category/i), 'defi');
    expect(setCategory).toHaveBeenCalledWith('defi');

    await user.selectOptions(screen.getByLabelText(/category/i), '');
    expect(setCategory).toHaveBeenLastCalledWith(null);
  });

  it('toggles favorites-only checkbox', async () => {
    const user = userEvent.setup();
    render(
      <CoinFilters
        state={baseState}
        setCategory={setCategory}
        setFavoritesOnly={setFavoritesOnly}
        reset={reset}
      />,
    );

    await user.click(screen.getByLabelText(/favorites only/i));
    expect(setFavoritesOnly).toHaveBeenCalledWith(true);
  });

  it('fires reset on click', async () => {
    const user = userEvent.setup();
    render(
      <CoinFilters
        state={baseState}
        setCategory={setCategory}
        setFavoritesOnly={setFavoritesOnly}
        reset={reset}
      />,
    );

    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
