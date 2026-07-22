/**
 * React Query v4 reports `isLoading: true` on disabled queries that have not
 * fetched yet. Scope-gated hooks (project/org/account) must ignore loading
 * from queries whose `enabled` flag is false, or aggregate loading stays true
 * forever and pre-select cards show "Loading…" indefinitely.
 *
 * @remarks React Query v5: v4's "no data yet" signal is `isPending` (`isLoading`
 * is now `isPending && isFetching`). When upgrading, revisit whether callers
 * should pass `isPending` and whether this helper's enabled guard still fits.
 */
export function queryLoadingWhileEnabled(
  enabled: boolean,
  query: { isLoading: boolean; isFetching?: boolean }
): boolean {
  if (!enabled) return false
  return query.isLoading || Boolean(query.isFetching)
}
