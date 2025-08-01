import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  createFavorite,
  deleteFavorite,
  ListReposQueryQueryParams,
  useDeleteRepositoryMutation,
  useListReposQuery
} from '@harnessio/code-service-client'
import { Toast, useToast } from '@harnessio/ui/components'
import { ExtendedScope, RepoListFilters, RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { getRepoUrl } from '../../utils/scope-url-utils'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

export default function ReposListPage() {
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
  const { renderUrl } = useMFEContext()
  const basename = `/ng${renderUrl}`

  const [query, setQuery] = useQueryState('query')
  const { queryPage, setQueryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const [favorite, setFavorite] = useQueryState<boolean>('favorite')
  const [recursive, setRecursive] = useQueryState<boolean>('recursive')
  const { scope } = useMFEContext()
  const [sort, setSort] = useQueryState<ListReposQueryQueryParams['sort']>('sort')
  const [order, setOrder] = useQueryState<ListReposQueryQueryParams['order']>('order')

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
        query: query ?? '',
        only_favorites: favorite,
        recursive,
        sort,
        order
      },
      space_ref: `${spaceURL}/+`
    },
    {
      retry: 5
    }
  )
  const PAGE_SIZE = parseInt(headers?.get(PageResponseHeader.xPerPage) || '25')

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
    if (repoData) {
      const transformedRepos = transformRepoList(repoData)
      setRepositories(transformedRepos, totalItems, PAGE_SIZE)
    } else {
      setRepositories([], totalItems, PAGE_SIZE)
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

  const onFavoriteToggle = async ({ repoId, isFavorite }: { repoId: number; isFavorite: boolean }) => {
    try {
      if (isFavorite) {
        await createFavorite({
          body: {
            resource_id: repoId,
            resource_type: 'REPOSITORY'
          }
        })
      } else {
        await deleteFavorite({
          queryParams: { resource_type: 'REPOSITORY' },
          resource_id: repoId
        })
      }
      const updated = repositories?.map(repo => (repo.id === repoId ? { ...repo, favorite: isFavorite } : repo)) ?? []
      setRepositories(updated, updated.length, PAGE_SIZE)
    } catch {
      // TODO: Add error handling
    }
  }

  const { accountId, orgIdentifier, projectIdentifier } = scope

  return (
    <SandboxRepoListPage
      scope={{
        accountId: accountId || '',
        orgIdentifier,
        projectIdentifier
      }}
      useRepoStore={useRepoStore}
      isLoading={isFetching}
      isError={isError}
      errorMessage={error?.message}
      searchQuery={query}
      setSearchQuery={setQuery}
      setQueryPage={setQueryPage}
      onClickRepo={(repo: RepositoryType) => {
        const toRepository = getRepoUrl({
          repo,
          scope: {
            accountId: accountId || '',
            orgIdentifier,
            projectIdentifier
          },
          toRepository: () => routes.toRepoSummary({ spaceId, repoId: repo.name })
        })

        const fullPath = `${basename}${toRepository}`
        /**
         * @todo fix this properly to avoid full page refresh. Currently, not able to navigate properly with react router.
         */
        window.location.href = fullPath
      }}
      toCreateRepo={() => routes.toCreateRepo({ spaceId })}
      toImportRepo={() => routes.toImportRepo({ spaceId })}
      toImportMultipleRepos={() => routes.toImportMultipleRepos({ spaceId })}
      onFavoriteToggle={onFavoriteToggle}
      onFilterChange={({ favorite, recursive }: RepoListFilters) => {
        setFavorite(favorite ?? null)
        if (!recursive) return

        if (accountId && orgIdentifier && projectIdentifier) return

        if (accountId && orgIdentifier) {
          setRecursive(recursive.value === ExtendedScope.OrgProg)
        } else if (accountId) {
          setRecursive(recursive.value === ExtendedScope.All)
        }
      }}
      onSortChange={(sortValues: string) => {
        const [type, direction] = sortValues?.split(',') || []
        const sortKey = type as ListReposQueryQueryParams['sort'] | undefined
        const orderKey = direction as ListReposQueryQueryParams['order'] | undefined

        setSort(sortKey ?? null)
        setOrder(orderKey ?? null)
      }}
    />
  )
}

ReposListPage.displayName = 'ReposListPage'
