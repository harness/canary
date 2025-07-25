import { ScopeType } from '@views/common'

export const determineScope = ({
  accountId,
  repoIdentifier,
  repoPath
}: {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
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
