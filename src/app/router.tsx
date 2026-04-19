import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import CoinsListPage from '../features/coins/pages/CoinsListPage';
import CoinDetailsPage from '../features/coins/pages/CoinDetailsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: CoinsListPage },
      { path: 'coin/:id', Component: CoinDetailsPage },
    ],
  },
]);
