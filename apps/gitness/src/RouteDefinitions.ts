export type PathParams = {
  spaceId?: string
  repoId?: string
  pipelineId?: string
  executionId?: string
  pullRequestId?: string
  gitRef?: string
  resourcePath?: string
}

export const PathProps = {
  spaceId: ':spaceId*',
  repoId: ':repoId',
  pipelineId: ':pipelineId',
  executionId: ':executionId',
  pullRequestId: ':pullRequestId',
  gitRef: ':gitRef*',
  resourcePath: ':resourcePath*'
}

export type PullRequestRoutePathParams = Omit<PathParams, 'pipelineId' | 'executionId' | 'gitRef'>

export interface AppRoutes {
  toPullRequest: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) => string
  toPullRequestConversation: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) => string
  toPullRequestCommits: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) => string
  toPullRequestChanges: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) => string
  toPullRequestChecks: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) => string
}

export const routes: AppRoutes = {
  toPullRequest: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) =>
    `${spaceId}/repos/${repoId}/pull-requests/${pullRequestId}`,
  toPullRequestConversation: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) =>
    `${spaceId}/repos/${repoId}/pull-requests/${pullRequestId}/conversation`,
  toPullRequestCommits: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) =>
    `${spaceId}/repos/${repoId}/pull-requests/${pullRequestId}/commits`,
  toPullRequestChanges: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) =>
    `${spaceId}/repos/${repoId}/pull-requests/${pullRequestId}/changes`,
  toPullRequestChecks: ({ spaceId, repoId, pullRequestId }: PullRequestRoutePathParams) =>
    `${spaceId}/repos/${repoId}/pull-requests/${pullRequestId}/checks`
}
