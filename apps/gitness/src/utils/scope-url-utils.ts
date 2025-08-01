import { getScopedPath } from '@harnessio/ui/components'
import { RepositoryType, Scope } from '@harnessio/ui/views'

import { RouteFunctionMap } from '../framework/routing/types'

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
  toRepository
}: {
  repo: RepositoryType
  scope: Scope
  toRepository: RouteFunctionMap['toRepoSummary']
}): string => {
  const scopedPath = getScopedPath({
    accountId: scope.accountId,
    repoIdentifier: repo.name,
    repoPath: repo.path
  }).split('/')
  const [orgId, projectId] = scopedPath
  const url = toRepository?.() ?? ''
  return prependScopeToUrl({ url, scope, orgId, projectId })
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
