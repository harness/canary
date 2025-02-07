import { ImporterProviderType } from '@harnessio/code-service-client'
import { ImportMultipleReposFormFields, ImportRepoFormFields, ProviderOptionsEnum } from '@harnessio/ui/views'

export const PROVIDER_TYPE_MAP: Record<ProviderOptionsEnum, ImporterProviderType> = {
  [ProviderOptionsEnum.GITHUB]: 'github',
  [ProviderOptionsEnum.GITHUB_ENTERPRISE]: 'github',
  [ProviderOptionsEnum.GITLAB_SELF_HOSTED]: 'gitlab',
  [ProviderOptionsEnum.GITLAB]: 'gitlab',
  [ProviderOptionsEnum.BITBUCKET]: 'bitbucket',
  [ProviderOptionsEnum.BITBUCKET_SERVER]: 'stash',
  [ProviderOptionsEnum.GITEA]: 'gitea',
  [ProviderOptionsEnum.GOGS]: 'gogs',
  [ProviderOptionsEnum.AZURE_DEVOPS]: 'azure'
}

export const getRepoProviderConfig = (data: ImportRepoFormFields | ImportMultipleReposFormFields) => {
  if (!data) return ''

  const PROVIDER_REPO_CONFIG = {
    [ProviderOptionsEnum.GITHUB]: data.organization,
    [ProviderOptionsEnum.GITHUB_ENTERPRISE]: data.organization,
    [ProviderOptionsEnum.GITLAB_SELF_HOSTED]: data.group,
    [ProviderOptionsEnum.GITLAB]: data.group,
    [ProviderOptionsEnum.BITBUCKET]: data.workspace,
    [ProviderOptionsEnum.BITBUCKET_SERVER]: data.project,
    [ProviderOptionsEnum.GITEA]: data.organization,
    [ProviderOptionsEnum.GOGS]: data.organization,
    [ProviderOptionsEnum.AZURE_DEVOPS]: `${data.organization}/${data.project}`
  }

  return PROVIDER_REPO_CONFIG[data.provider] as string
}
