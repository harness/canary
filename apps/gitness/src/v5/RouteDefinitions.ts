import { PathParams } from '../RouteDefinitions'

export const getReposListPath = (pathPrefix: string) => `${pathPrefix}/repos`
export const getCreateRepoPath = (pathPrefix: string) => `${pathPrefix}/repos/create`
export const getImportRepoPath = (pathPrefix: string) => `${pathPrefix}/repos/import`
export const getImportMultipleReposPath = (pathPrefix: string) => `${pathPrefix}/repos/import-multiple`

export const getRepoBasePath = (pathPrefix: string, repoId: PathParams['repoId']) => `${pathPrefix}/repos/${repoId}`
export const getRepoSummaryPath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/summary`

export const getRepoCodeBasePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/code`
export const getRepoCodePath = (pathPrefix: string, repoId: PathParams['repoId'], subPath = '') =>
  `${getRepoCodeBasePath(pathPrefix, repoId)}${subPath}`

export const getRepoCommitsPath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/commits`
export const getRepoCommitDetailsPath = (pathPrefix: string, repoId: PathParams['repoId'], commitSHA: string) =>
  `${getRepoCommitsPath(pathPrefix, repoId)}/${commitSHA}`

export const getRepoBranchesPath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/branches`
export const getRepoTagsPath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/tags`

export const getPullRequestsBasePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/pulls`
export const getPullRequestsListPath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  getPullRequestsBasePath(pathPrefix, repoId)
export const getCreatePullRequestPath = (pathPrefix: string, repoId: PathParams['repoId'], diffRefs?: string) =>
  diffRefs
    ? `${getPullRequestsBasePath(pathPrefix, repoId)}/compare/${diffRefs}`
    : `${getPullRequestsBasePath(pathPrefix, repoId)}/compare`

export const getPullRequestBasePath = (
  pathPrefix: string,
  repoId: PathParams['repoId'],
  pullRequestId: PathParams['pullRequestId']
) => `${getPullRequestsBasePath(pathPrefix, repoId)}/${pullRequestId}`
export const getPullRequestConversationPath = (
  pathPrefix: string,
  repoId: PathParams['repoId'],
  pullRequestId: PathParams['pullRequestId']
) => `${getPullRequestBasePath(pathPrefix, repoId, pullRequestId)}/conversation`
export const getPullRequestCommitsPath = (
  pathPrefix: string,
  repoId: PathParams['repoId'],
  pullRequestId: PathParams['pullRequestId']
) => `${getPullRequestBasePath(pathPrefix, repoId, pullRequestId)}/commits`
export const getPullRequestChangesPath = (
  pathPrefix: string,
  repoId: PathParams['repoId'],
  pullRequestId: PathParams['pullRequestId']
) => `${getPullRequestBasePath(pathPrefix, repoId, pullRequestId)}/changes`
export const getPullRequestChecksPath = (
  pathPrefix: string,
  repoId: PathParams['repoId'],
  pullRequestId: PathParams['pullRequestId']
) => `${getPullRequestBasePath(pathPrefix, repoId, pullRequestId)}/checks`

export const getRepoSettingsBasePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoBasePath(pathPrefix, repoId)}/settings`
export const getRepoSettingsGeneralPath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsBasePath(pathPrefix, repoId)}/general`

export const getRepoSettingsRulesBasePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsBasePath(pathPrefix, repoId)}/rules`
export const getRepoSettingsRulesCreatePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsRulesBasePath(pathPrefix, repoId)}/create`
export const getRepoSettingsRuleDetailsPath = (pathPrefix: string, repoId: PathParams['repoId'], ruleId: string) =>
  `${getRepoSettingsRulesBasePath(pathPrefix, repoId)}/${ruleId}`

export const getRepoSettingsWebhooksBasePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsBasePath(pathPrefix, repoId)}/webhooks`
export const getRepoSettingsWebhooksCreatePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsWebhooksBasePath(pathPrefix, repoId)}/create`

export const getRepoSettingsLabelsBasePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsBasePath(pathPrefix, repoId)}/labels`
export const getRepoSettingsLabelsCreatePath = (pathPrefix: string, repoId: PathParams['repoId']) =>
  `${getRepoSettingsLabelsBasePath(pathPrefix, repoId)}/create`
export const getRepoSettingsLabelDetailsPath = (pathPrefix: string, repoId: PathParams['repoId'], labelId: string) =>
  `${getRepoSettingsLabelsBasePath(pathPrefix, repoId)}/${labelId}`
