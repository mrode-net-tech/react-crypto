interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-100"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-90">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center rounded-md border border-rose-300 px-3 py-1.5 text-sm font-medium hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/40"
        >
          Retry
        </button>
      )}
    </div>
  );
}
