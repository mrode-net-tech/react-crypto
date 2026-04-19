interface PaginationProps {
  page: number;
  /** True when the current page is full (perPage rows). Drives `next` enablement. */
  hasNext: boolean;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  hasNext,
  isFetching = false,
  onPageChange,
}: PaginationProps) {
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(page + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3"
    >
      <button
        type="button"
        onClick={prev}
        disabled={page <= 1 || isFetching}
        className="h-9 rounded-md border border-slate-300 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        ← Previous
      </button>

      <span
        aria-live="polite"
        className="text-sm text-slate-600 dark:text-slate-400"
      >
        Page <strong>{page}</strong>
      </span>

      <button
        type="button"
        onClick={next}
        disabled={!hasNext || isFetching}
        className="h-9 rounded-md border border-slate-300 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Next →
      </button>
    </nav>
  );
}
