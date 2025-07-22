import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import { useDeleteRepositoryMutation, useListReposQuery } from '@harnessio/code-service-client'
import { Toast, useToast } from '@harnessio/ui/components'
import { RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useAPIPath } from '../../hooks/useAPIPath'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

interface TData {
  resource_id: number
  resource_type: 'REPOSITORY'
}

type TVariables = {
  resource_id: number
}

type TError = unknown

export default function ReposListPage() {
  const getApiPath = useAPIPath()
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''
  const {
    setRepositories,
    repositories,
    page,
    setPage,
    importRepoIdentifier,
    setImportRepoIdentifier,
    importToastId,
    setImportToastId
  } = useRepoStore()
  const { toast, dismiss } = useToast()

  const [query, setQuery] = useQueryState('query')
  const { queryPage, setQueryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const {
    data: { body: repoData, headers } = {},
    refetch: refetchListRepos,
    isFetching,
    isError,
    error
  } = useListReposQuery(
    {
      queryParams: {
        page: queryPage,
        query: query ?? ''
      },
      space_ref: `${spaceURL}/+`
    },
    {
      retry: 5
    }
  )
  const PAGE_SIZE = parseInt(headers?.get(PageResponseHeader.xPerPage) || '10')

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
    const totalItems = parseInt(headers?.get(PageResponseHeader.xTotal) || '0')
    const perPage = parseInt(headers?.get(PageResponseHeader.xPerPage) || '10')
    if (repoData) {
      const transformedRepos = transformRepoList(repoData)
      setRepositories(transformedRepos, totalItems, perPage)
    } else {
      setRepositories([], totalItems, perPage)
    }
  }, [repoData, headers, setRepositories])

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

  const { mutate: createFavorite } = useMutation<TData, TError, TVariables>({
    mutationFn: ({ resource_id }) =>
      fetch(getApiPath('/api/v1/user/favorite'), {
        method: 'POST',
        body: JSON.stringify({ resource_id, resource_type: 'REPOSITORY' })
      }).then(res => res.json()),
    onSuccess: data => {
      const updatedRepos =
        repositories?.map(repo => (repo.id === data.resource_id ? { ...repo, is_favorite: true } : repo)) ?? []
      setRepositories(updatedRepos, updatedRepos.length, PAGE_SIZE)
    }
  })

  const { mutate: deleteFavorite } = useMutation<unknown, TError, TVariables>({
    mutationFn: ({ resource_id }) =>
      fetch(getApiPath('/api/v1/user/favorite'), {
        method: 'DELETE',
        body: JSON.stringify({ resource_id, resource_type: 'REPOSITORY' })
      }).then(res => res.json()),
    onMutate: variables => {
      const updatedRepos =
        repositories?.map(repo => (repo.id === variables.resource_id ? { ...repo, is_favorite: false } : repo)) ?? []
      setRepositories(updatedRepos, updatedRepos.length, PAGE_SIZE)
    }
  })

  const onFavoriteToggle = ({ repoId, isFavorite }: { repoId: number; isFavorite: boolean }) => {
    const mutation = isFavorite ? deleteFavorite : createFavorite
    mutation({ resource_id: repoId })
  }

  return (
    <SandboxRepoListPage
      useRepoStore={useRepoStore}
      isLoading={isFetching}
      isError={isError}
      errorMessage={error?.message}
      searchQuery={query}
      setSearchQuery={setQuery}
      setQueryPage={setQueryPage}
      toRepository={(repo: RepositoryType) => routes.toRepoSummary({ spaceId, repoId: repo.name })}
      toCreateRepo={() => routes.toCreateRepo({ spaceId })}
      toImportRepo={() => routes.toImportRepo({ spaceId })}
      toImportMultipleRepos={() => routes.toImportMultipleRepos({ spaceId })}
      onFavoriteToggle={onFavoriteToggle}
    />
  )
}

ReposListPage.displayName = 'ReposListPage'
