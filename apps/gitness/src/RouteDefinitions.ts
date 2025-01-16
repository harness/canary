export type PathParams = {
  spaceId?: string
  repoId?: string
  pipelineId?: string
  executionId?: string
  pullRequestId?: string
  gitRef?: string
  commitSHA?: string
  resourcePath?: string
  diffRefs?: string
  webhookId?: string
}

export const PathProps = {
  spaceId: ':spaceId*',
  repoId: ':repoId',
  pipelineId: ':pipelineId',
  executionId: ':executionId',
  pullRequestId: ':pullRequestId',
  gitRef: ':gitRef*',
  resourcePath: ':resourcePath*',
  diffRefs: ':diffRefs*'
}
