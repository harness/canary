import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useDeleteRepositoryMutation, useListReposQuery } from '@harnessio/code-service-client'
import { Toast, useToast } from '@harnessio/ui/components'
import { RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

export default function ReposListPage() {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''
  const {
    setRepositories,
    page,
    setPage,
    importRepoIdentifier,
    setImportRepoIdentifier,
    importToastId,
    setImportToastId
  } = useRepoStore()
  const { toast, dismiss } = useToast()

  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const {
    data: { body: repoData, headers } = {},
    refetch: refetchListRepos,
    isFetching,
    isError,
    error
  } = useListReposQuery(
    {
      queryParams: { page: queryPage, query: query ?? '' },
      space_ref: `${spaceURL}/+`
    },
    { retry: 5 }
  )

  const { mutate: deleteRepository, isLoading: isCancellingImport } = useDeleteRepositoryMutation(
    {},
    {
      onSuccess: () => {
        dismiss(importToastId ?? '')
        setImportToastId(null)
        setImportRepoIdentifier(null)
        refetchListRepos()
      }
    }
  )

  useEffect(() => {
    const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    if (repoData) {
      const transformedRepos = transformRepoList(repoData)
      setRepositories(transformedRepos, totalPages)
    } else {
      setRepositories([], totalPages)
    }
  }, [repoData, headers, setRepositories])

  useEffect(() => {
    toast({
      title: `Unable to create feature flag because of an OPA policy violation`,
      description:
        'We couldn’t complete your request because it violates an Open Policy Agent (OPA) rule set by your organization. Please review the applicable policies ',
      duration: 300000,
      action: <Toast.Action altText="Cancel import">{isCancellingImport ? 'Canceling...' : 'Cancel'}</Toast.Action>
    })
    toast({
      title: `Unable to create feature flag because of an OPA policy violation`,
      description:
        'We couldn’t complete your request because it violates an Open Policy Agent (OPA) rule set by your organization. Please review the applicable policies ',
      duration: 300000,
      withIndicator: true,
      variant: 'success'
    })
    toast({
      title: `!! Unable to create feature flag because of an OPA policy violation`,
      description:
        '!! We couldn’t complete your request because it violates an Open Policy Agent (OPA) rule set by your organization. Please review the applicable policies ',
      duration: 300000,
      withIndicator: true,
      variant: 'failed'
    })
  }, [])

  useEffect(() => {
    if (importRepoIdentifier && !importToastId) {
      const { id } = toast({
        title: `Import in progress`,
        description: importRepoIdentifier,
        duration: Infinity,
        action: (
          <Toast.Action
            onClick={() => {
              deleteRepository({
                queryParams: {},
                repo_ref: `${spaceURL}/${importRepoIdentifier}/+`
              })
            }}
            altText="Cancel import"
          >
            {isCancellingImport ? 'Canceling...' : 'Cancel'}
          </Toast.Action>
        )
      })

      setImportToastId(id)
    }
  }, [importRepoIdentifier, setImportRepoIdentifier])

  return (
    <SandboxRepoListPage
      useRepoStore={useRepoStore}
      useTranslationStore={useTranslationStore}
      isLoading={isFetching}
      isError={isError}
      errorMessage={error?.message}
      searchQuery={query}
      setSearchQuery={setQuery}
      toRepository={(repo: RepositoryType) => routes.toRepoSummary({ spaceId, repoId: repo.name })}
      toCreateRepo={() => routes.toCreateRepo({ spaceId })}
      toImportRepo={() => routes.toImportRepo({ spaceId })}
    />
  )
}
