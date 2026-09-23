/**
 * Zustand PR stores are module-level singletons. After switching PRs they still hold the
 * previous payload until the next successful fetch, so every read/write/query must confirm
 * the stored `number` is the one currently in the route.
 */
export const matchesPullRequestId = (
  prNumber: number | null | undefined,
  pullRequestId: string | number | null | undefined
): boolean => {
  if (prNumber == null || pullRequestId == null || pullRequestId === '') {
    return false
  }
  const prIdNumber = Number(pullRequestId)
  return Number.isFinite(prNumber) && Number.isFinite(prIdNumber) && prNumber === prIdNumber
}
