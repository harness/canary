import { useNavigate, useParams } from 'react-router-dom'

import {
  OpenapiCreateRepositoryRequest,
  useCreateRepositoryMutation,
  useListGitignoreQuery,
  useListLicensesQuery
} from '@harnessio/code-service-client'
import { RepoCreateFormFields, RepoCreatePage as RepoCreatePageView } from '@harnessio/ui/views'

// import { Toaster } from '../../components-v2/toaster'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'

export const CreateRepo = () => {
  const routes = useRoutes()
  const { mutate: createRepository, error, isLoading, isSuccess } = useCreateRepositoryMutation({})
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()

  const onSubmit = (data: RepoCreateFormFields) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: 'main',
      parent_ref: spaceURL,
      description: data.description,
      git_ignore: data.gitignore,
      license: data.license,
      is_public: data.access === '1',
      readme: data.readme,
      identifier: data.name
    }

    createRepository(
      {
        queryParams: {
          space_path: spaceURL
        },
        body: repositoryRequest
      },
      {
        onSuccess: ({ body: data }) => {
          navigate(routes.toRepoSummary({ spaceId, repoId: data?.identifier }))
        }
      }
    )
  }

  const { data: { body: gitIgnoreOptions } = {} } = useListGitignoreQuery({})

  const { data: { body: licenseOptions } = {} } = useListLicensesQuery({})

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    <>
      <RepoCreatePageView
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        isLoading={isLoading}
        isSuccess={isSuccess}
        gitIgnoreOptions={gitIgnoreOptions}
        licenseOptions={licenseOptions}
        useTranslationStore={useTranslationStore}
        apiError={error?.message?.toString()}
      />
    </>
  )
}
