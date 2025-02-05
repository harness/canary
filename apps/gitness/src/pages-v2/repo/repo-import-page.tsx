import { useNavigate, useParams } from 'react-router-dom'

import {
  ImporterProviderType,
  ImportRepositoryRequestBody,
  useImportRepositoryMutation
} from '@harnessio/code-service-client'
import { ImportRepoFormFields, ProviderOptionsEnum, RepoImportPage as RepoImportPageView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'

export const ImportRepo = () => {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()
  const { mutate: importRepoMutation, error, isLoading } = useImportRepositoryMutation({})

  const onSubmit = async (data: ImportRepoFormFields) => {
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

    const PROVIDER_TYPE_MAP = {
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

    const providerRepo = PROVIDER_REPO_CONFIG[data.provider as ProviderOptionsEnum]
    const body: ImportRepositoryRequestBody = {
      identifier: data.identifier,
      description: data.description,
      parent_ref: spaceURL,
      pipelines: data.pipelines === true ? 'convert' : 'ignore',
      provider: {
        host: data.hostUrl ?? '',
        password: data.password,
        type: PROVIDER_TYPE_MAP[data.provider as ProviderOptionsEnum] as ImporterProviderType,
        username: ''
      },
      provider_repo: `${providerRepo}/${data.repository}`
    }
    importRepoMutation(
      {
        queryParams: {},
        body: body
      },
      {
        onSuccess: () => {
          navigate(routes.toRepositories({ spaceId }))
        }
      }
    )
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    <>
      <RepoImportPageView
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        isLoading={isLoading}
        apiErrorsValue={error?.message?.toString()}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
