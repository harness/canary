import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  OpenapiCreateRepositoryRequest,
  useCreateRepositoryMutation,
  useListGitignoreQuery,
  useListLicensesQuery
} from '@harnessio/code-service-client'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'
import { RepoCreateFormFields, RepoCreatePageView, tagsToRecord } from './repo-create-page-view'

type GeneralSettingsResponse = {
  default_branch?: string
}

const decodeStoredToken = (encodedToken: string): string => {
  try {
    return JSON.parse(decodeURIComponent(atob(encodedToken)))
  } catch {
    return encodedToken
  }
}

const getScopeIdentifiers = ({
  spaceURL,
  accountId,
  orgIdentifier,
  projectIdentifier
}: {
  spaceURL: string
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}) => {
  const [spaceAccountId, spaceOrgIdentifier, spaceProjectIdentifier] = spaceURL.split('/').filter(Boolean)

  return {
    accountIdentifier: accountId || spaceAccountId,
    orgIdentifier: orgIdentifier || spaceOrgIdentifier,
    projectIdentifier: projectIdentifier || spaceProjectIdentifier
  }
}

export const CreateRepo = () => {
  const routes = useRoutes()
  const { mutate: createRepository, error, isLoading, isSuccess } = useCreateRepositoryMutation({})
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const { scope } = useMFEContext()
  const navigate = useNavigate()
  const [initialDefaultBranch, setInitialDefaultBranch] = useState<string>('main')

  const scopeIdentifiers = useMemo(
    () =>
      getScopeIdentifiers({
        spaceURL: spaceURL || '',
        accountId: scope.accountId,
        orgIdentifier: scope.orgIdentifier,
        projectIdentifier: scope.projectIdentifier
      }),
    [spaceURL, scope.accountId, scope.orgIdentifier, scope.projectIdentifier]
  )

  useEffect(() => {
    const { accountIdentifier, orgIdentifier, projectIdentifier } = scopeIdentifiers
    if (!accountIdentifier || !orgIdentifier || !projectIdentifier) return

    const rawToken = localStorage.getItem('token')
    const decodedToken = rawToken ? decodeStoredToken(rawToken) : ''

    const params = new URLSearchParams({
      accountIdentifier
    })

    if (orgIdentifier) {
      params.set('orgIdentifier', orgIdentifier)
    }

    if (projectIdentifier) {
      params.set('projectIdentifier', projectIdentifier)
    }

    if (scope.accountId) {
      params.set('routingId', scope.accountId)
    }

    const headers = new Headers({
      Accept: 'application/json'
    })

    if (decodedToken.startsWith('pat.')) {
      headers.set('x-api-key', decodedToken)
    } else if (decodedToken) {
      headers.set('Authorization', `Bearer ${decodedToken}`)
    }

    fetch(`${window.apiUrl || ''}/code/api/v1/settings/general?${params.toString()}`, { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.status}`)
        }
        return response.json() as Promise<GeneralSettingsResponse>
      })
      .then(data => {
        const branch = data.default_branch?.trim()
        if (branch) {
          setInitialDefaultBranch(branch)
        }
      })
      .catch(() => {
        // Keep fallback branch as `main` if settings request fails.
      })
  }, [scope.accountId, scopeIdentifiers])

  const onSubmit = (data: RepoCreateFormFields) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: data.defaultBranch,
      parent_ref: spaceURL,
      description: data.description,
      git_ignore: data.gitignore,
      license: data.license,
      is_public: data.access === '1',
      readme: data.readme,
      identifier: data.name,
      tags: data.tags?.length ? tagsToRecord(data.tags) : undefined
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
        apiError={error?.message?.toString()}
        initialDefaultBranch={initialDefaultBranch}
      />
    </>
  )
}
