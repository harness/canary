import { ScopeType } from '@/types'

/**
 * Determines the scope type (Account, Organization, or Project) based on the provided
 * account ID, repository identifier, and repository path.
 *
 * The function analyzes the structure of the `repoPath` to infer the scope:
 * - If the path is in the form `accountId/repoIdentifier`, it is considered an Account scope.
 * - If the path is in the form `accountId/org/repoIdentifier`, it is considered an Organization scope.
 * - If the path is in the form `accountId/org/project/repoIdentifier`, it is considered a Project scope.
 *
 * @param params - An object containing:
 *   @param accountId - The account identifier.
 *   @param repoIdentifier - The repository identifier.
 *   @param repoPath - The full repository path.
 * @returns The determined {@link ScopeType} or `undefined` if the path does not match any known scope.
 */
export const determineScope = ({
  accountId,
  repoIdentifier,
  repoPath
}: {
  accountId: string
  repoIdentifier: string
  repoPath: string
}): ScopeType | undefined => {
  const parts = repoPath.split('/')

  if (parts.length === 2 && parts[0] === accountId && parts[1] === repoIdentifier) {
    return ScopeType.Account
  }

  if (parts.length === 3 && parts[0] === accountId && parts[2] === repoIdentifier) {
    return ScopeType.Organization
  }

  if (parts.length === 4 && parts[0] === accountId && parts[3] === repoIdentifier) {
    return ScopeType.Project
  }
}

/**
 * Returns a scoped repository path by removing the specified `accountId` and `repoIdentifier`
 * from the given `repoPath`.
 *
 * @param params - An object containing:
 *   @param accountId - The account identifier to remove from the path.
 *   @param repoIdentifier - The repository identifier to remove from the path.
 *   @param repoPath - The original repository path to be scoped.
 * @returns The repository path with the account and repository identifiers removed.
 */
export const getScopedPath = ({
  accountId,
  repoIdentifier,
  repoPath
}: {
  accountId: string
  repoIdentifier: string
  repoPath: string
}): string => {
  const parts = repoPath.split('/')
  const filteredParts = parts.filter(part => part !== accountId && part !== repoIdentifier)
  return filteredParts.join('/')
}
