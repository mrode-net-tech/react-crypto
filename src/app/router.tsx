import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import RootLayout from './RootLayout';
import CoinsListPage from '../features/coins/pages/CoinsListPage';

/* eslint-disable react-refresh/only-export-components */
const CoinDetailsPage = lazy(
  () => import('../features/coins/pages/CoinDetailsPage'),
);

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
