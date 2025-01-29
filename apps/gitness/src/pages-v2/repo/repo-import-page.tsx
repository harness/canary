import { useNavigate, useParams } from 'react-router-dom'

import { ImportRepositoryRequestBody, useImportRepositoryMutation } from '@harnessio/code-service-client'
import { ImportRepoFormFields, RepoImportPage as RepoImportPageView } from '@harnessio/ui/views'

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
    const body: ImportRepositoryRequestBody = {
      identifier: data.identifier,
      description: data.description,
      parent_ref: spaceURL,
      pipelines: data.pipelines === true ? 'convert' : 'ignore',
      provider: {
        host: data.hostUrl ?? '',
        password: data.password,
        type: 'github',
        username: ''
      },
      provider_repo: `${data.organization}/${data.repository}`
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
