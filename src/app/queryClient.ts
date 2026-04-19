import { QueryClient } from '@tanstack/react-query';

/*
  Defaults rationale:
  - staleTime 60s: CoinGecko free tier is rate-limited; treating data as fresh
    for a minute prevents accidental refetch storms when components remount.
  - refetchOnWindowFocus disabled: we already auto-refresh the coins list every
    60s via refetchInterval on that specific query — re-fetching on every tab
    switch would burn the rate limit for no real UX gain.
  - retry 1: a single retry handles transient blips without making the user
    wait through three exponential backoffs on a real outage.
*/
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
