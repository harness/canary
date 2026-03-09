import { determineScope, getScopedPath } from '@harnessio/ui/components'
import { RepositoryType, Scope, ScopeType, ScopeValue } from '@harnessio/views'

export const getScopeType = ({ accountId, orgIdentifier, projectIdentifier }: Scope): ScopeType => {
  if (accountId && orgIdentifier && projectIdentifier) return ScopeType.Project
  if (accountId && orgIdentifier) return ScopeType.Organization
  return ScopeType.Account
}

export const prependScopeToUrl = ({
  url,
  scope,
  orgId,
  projectId
}: {
  url: string
  scope: Scope
  orgId?: string
  projectId?: string
}): string => {
  // If accessing a Project-scoped repository from the Org-level repository list,
  // ensure the URL contains the project identifier.
  if (!scope.projectIdentifier && projectId) {
    url = `/projects/${projectId}${url.replace(/\/projects\/[^/]+/, '')}`
  }

  // If accessing an Org-scoped repository from the Account-level repository list,
  // ensure the URL contains the org identifier.
  if (!scope.orgIdentifier && orgId) {
    url = `/orgs/${orgId}${url.replace(/\/orgs\/[^/]+/, '')}`
  }

  return url
}

export const getRepoUrl = ({
  repo,
  scope,
  repoSubPath
}: {
  repo: RepositoryType
  scope: Scope
  repoSubPath: string
}): string => {
  const scopedPath = getScopedPath({
    accountId: scope.accountId,
    repoIdentifier: repo.name,
    repoPath: repo.path
  }).split('/')
  const [orgId, projectId] = scopedPath
  return prependScopeToUrl({ url: repoSubPath, scope, orgId, projectId })
}

export const getSpaceRefByScope = (spaceRef: string, scopeType: ScopeValue): string => {
  const [accountId, orgId, projectId] = spaceRef.split('/')
  switch (scopeType) {
    case ScopeValue.Account:
      return accountId
    case ScopeValue.Organization:
      return [accountId, orgId].filter(Boolean).join('/')
    case ScopeValue.Project:
      return [accountId, orgId, projectId].filter(Boolean).join('/')
    default:
      return spaceRef
  }
}

export const getPullRequestUrl = ({
  repo,
  scope,
  pullRequestSubPath
}: {
  repo: Pick<RepositoryType, 'name' | 'path'>
  scope: Scope
  pullRequestSubPath: string
}): string => {
  const scopedPath = getScopedPath({
    accountId: scope.accountId,
    repoIdentifier: repo.name,
    repoPath: repo.path
  }).split('/')
  const [orgId, projectId] = scopedPath
  return prependScopeToUrl({ url: pullRequestSubPath, scope, orgId, projectId })
}

/**
 * Checks if a repository/PR belongs to the same scope as the current view.
 * Used to determine navigation strategy (internal vs cross-scope MFE navigation).
 *
 * @param scope - Current scope context
 * @param repoIdentifier - Repository name/identifier
 * @param repoPath - Full repository path
 * @returns true if same scope, false if cross-scope navigation needed
 */
export const checkIsSameScope = ({
  scope,
  repoIdentifier,
  repoPath
}: {
  scope: Scope
  repoIdentifier: string
  repoPath: string
}): boolean => {
  /** Scope where the repo is currently displayed */
  const currentScopeType = getScopeType(scope)
  /** Scope where the repo actually belongs to */
  const actualScopeType = determineScope({
    accountId: scope.accountId,
    repoIdentifier,
    repoPath
  })
  return currentScopeType === actualScopeType
}
