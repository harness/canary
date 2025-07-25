import { ScopeType } from '@views/common'

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
    return ScopeType.Org
  }

  if (parts.length === 4 && parts[0] === accountId && parts[3] === repoIdentifier) {
    return ScopeType.Project
  }
}

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
