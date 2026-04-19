import { Outlet, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight hover:opacity-80"
          >
            Crypto Coins
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
