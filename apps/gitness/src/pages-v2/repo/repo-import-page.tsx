import { useNavigate } from 'react-router-dom'

import { ImportRepositoryRequestBody, useImportRepositoryMutation } from '@harnessio/code-service-client'
import { ImportRepoFormFields, RepoImportPage as RepoImportPageView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { getRepoProviderConfig, PROVIDER_TYPE_MAP } from './constants/import-providers-map'
import { useRepoStore } from './stores/repo-list-store'

export const ImportRepo = () => {
  const routes = useRoutes()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()
  const { mutate: importRepoMutation, error, isLoading } = useImportRepositoryMutation({})
  const { setImportRepoIdentifier } = useRepoStore()

  const onSubmit = async (data: ImportRepoFormFields) => {
    setImportRepoIdentifier(data.identifier)
    const providerRepo = getRepoProviderConfig(data)
    const body: ImportRepositoryRequestBody = {
      identifier: data.identifier,
      description: data.description,
      parent_ref: spaceURL,
      pipelines: data.pipelines ? 'convert' : 'ignore',
      provider: {
        host: data.hostUrl ?? '',
        password: data.password,
        type: PROVIDER_TYPE_MAP[data.provider],
        username: ''
      },
      provider_repo: `${providerRepo}/${data.repository}`
    }
    importRepoMutation(
      {
        queryParams: {
          space_path: spaceURL
        },
        body: body
      },
      {
        onSuccess: () => {
          navigate(routes.toRepositories({ spaceId: spaceURL }))
        }
      }
    )
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId: spaceURL }))
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
