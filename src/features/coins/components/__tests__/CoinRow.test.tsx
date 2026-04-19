import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { FavoritesProvider } from '../../../../contexts/favorites';
import type { CoinMarket } from '../../../../types/coingecko';
import { CoinRow } from '../CoinRow';

const coin: CoinMarket = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  current_price: 65000,
  market_cap: 1_300_000_000_000,
  market_cap_rank: 1,
  fully_diluted_valuation: null,
  total_volume: 25_000_000_000,
  high_24h: null,
  low_24h: null,
  price_change_24h: null,
  price_change_percentage_24h: 2.5,
  market_cap_change_24h: null,
  market_cap_change_percentage_24h: null,
  circulating_supply: null,
  total_supply: null,
  max_supply: null,
  ath: null,
  ath_change_percentage: null,
  ath_date: null,
  atl: null,
  atl_change_percentage: null,
  atl_date: null,
  last_updated: '',
  price_change_percentage_1h_in_currency: 0.5,
  price_change_percentage_24h_in_currency: 2.5,
  price_change_percentage_7d_in_currency: -1.2,
};

function renderRow(coinOverride: CoinMarket = coin) {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <table>
          <tbody>
            <CoinRow coin={coinOverride} />
          </tbody>
        </table>
      </FavoritesProvider>
    </MemoryRouter>,
  );
}

describe('CoinRow', () => {
  it('renders rank, name, formatted price and market data', () => {
    renderRow();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('btc')).toBeInTheDocument();
    expect(screen.getByText('$65,000.00')).toBeInTheDocument();
    expect(screen.getByText('$1.3T')).toBeInTheDocument();
    expect(screen.getByText('$25B')).toBeInTheDocument();
  });

  it('links the name to /coin/:id', () => {
    renderRow();
    const link = screen.getByRole('link', { name: /bitcoin/i });
    expect(link).toHaveAttribute('href', '/coin/bitcoin');
  });

  it('shows price changes with sign', () => {
    renderRow();
    expect(
      screen.getByLabelText('Bitcoin 1 hour change'),
    ).toHaveTextContent('+0.50%');
    expect(
      screen.getByLabelText('Bitcoin 7 day change'),
    ).toHaveTextContent('-1.20%');
  });

  it('toggles favorite without navigating to the details page', async () => {
    const user = userEvent.setup();
    renderRow();

    const fav = screen.getByRole('button', {
      name: /add bitcoin to favorites/i,
    });
    await user.click(fav);

    expect(
      screen.getByRole('button', {
        name: /remove bitcoin from favorites/i,
      }),
    ).toBeInTheDocument();
  });
});
