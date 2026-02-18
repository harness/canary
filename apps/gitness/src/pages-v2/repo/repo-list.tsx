import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  createFavorite,
  deleteFavorite,
  ListReposQueryQueryParams,
  useDeleteRepositoryMutation,
  useListReposQuery
} from '@harnessio/code-service-client'
import { toast } from '@harnessio/ui/components'
import { ExtendedScope, RepoListFilters, RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store-v2'
import { useUpstreamRepoUrl } from '../../hooks/useUpstreamRepoUrl'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { checkIsSameScope, getRepoUrl } from '../../utils/scope-url-utils'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

export default function ReposListPage() {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''
  const {
    setRepositories,
    repositories,
    page,
    setPage,
    totalItems,
    pageSize,
    importRepoIdentifier,
    setImportRepoIdentifier,
    importToastId,
    setImportToastId
  } = useRepoStore()
  const isMFE = useIsMFE()
  const [query, setQuery] = useQueryState('query')
  const { queryPage, setQueryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const [favorite, setFavorite] = useQueryState<boolean>('favorite')
  const [recursive, setRecursive] = useQueryState<boolean>('recursive')
  const { scope, renderUrl, routes: parentRoutes, routeUtils } = useMFEContext()
  const basename = `/ng${renderUrl}`
  const [sort, setSort] = useState<ListReposQueryQueryParams['sort']>('last_git_push')
  const [order, setOrder] = useState<ListReposQueryQueryParams['order']>('desc')

  // Ref to track when we need to reset page due to filter changes
  const shouldResetPageRef = useRef(false)

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
        order,
        limit: pageSize
      },
      space_ref: `${spaceURL}/+`
    },
    {
      retry: 5
    }
  )
  const PAGE_SIZE = parseInt(headers?.get(PageResponseHeader.xPerPage) || String(pageSize))

  const { mutate: deleteRepository, isLoading: isCancellingImport } = useDeleteRepositoryMutation(
    {},
    {
      onSuccess: () => {
        toast.dismiss(importToastId ?? '')
        setImportToastId(null)
        setImportRepoIdentifier(null)
        refetchListRepos()
      }
    }
  )

  // Effect to reset page when filters change
  useEffect(() => {
    if (shouldResetPageRef.current) {
      setQueryPage(1)
      shouldResetPageRef.current = false
    }
  }, [favorite, recursive, sort, order, setQueryPage])

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
    if (isCancellingImport) {
      toast.dismiss(importToastId ?? undefined)
      setImportToastId(null)
      setImportRepoIdentifier(null)
    }
  }, [isCancellingImport, importToastId, setImportToastId, setImportRepoIdentifier])

  useEffect(() => {
    if (importRepoIdentifier && !importToastId) {
      const importToastId = toast.loading({
        title: `Import ${importRepoIdentifier} in progress`,
        options: {
          action: {
            label: 'Cancel import',
            onClick: () => {
              deleteRepository({
                queryParams: {},
                repo_ref: `${spaceURL}/${importRepoIdentifier}/+`
              })
            }
          }
        }
      })
      setImportToastId(importToastId)
    }
  }, [importRepoIdentifier, setImportRepoIdentifier, deleteRepository, importToastId, spaceURL, setImportToastId])

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
      setRepositories(updated, totalItems, pageSize)
    } catch {
      // TODO: Add error handling
    }
  }

  const onCancelImport = async (repoId: string) => {
    try {
      await deleteRepository({
        queryParams: {},
        repo_ref: `${spaceURL}/${repoId}/+`
      })
    } catch {
      console.error('Error canceling import:', error)
    }
  }

  const { accountId, orgIdentifier, projectIdentifier } = scope

  const handleOnClickRepo = (repo: RepositoryType) => {
    const repoSummaryPath = routes.toRepoSummary({ spaceId, repoId: repo.name })

    if (!isMFE || checkIsSameScope({ scope, repoIdentifier: repo.name, repoPath: repo.path })) {
      navigate(repoSummaryPath)
    } else {
      if (routeUtils?.toCODERepository) {
        // Navigate with parent app's React Router
        routeUtils.toCODERepository?.({ repoPath: repo.path })
      }
    }
  }

  /**
   * Returns the URL for repo summary page.
   * This is used for command+click / "open in new tab" which triggers a full page load.
   * For normal clicks, onClickRepo handles navigation.
   */
  const handleToRepoSummary = (repo: RepositoryType): string => {
    const repoSummaryPath = routes.toRepoSummary({ spaceId, repoId: repo.name })

    if (!isMFE || checkIsSameScope({ scope, repoIdentifier: repo.name, repoPath: repo.path })) {
      return repoSummaryPath
    }

    // For cross-scope repos, return the parent app URL
    if (parentRoutes?.toCodeRepositoryPath && repo.path) {
      const baseRepoPath = parentRoutes.toCodeRepositoryPath({ repoPath: repo.path })
      return `${baseRepoPath}/summary`
    }

    // Fallback: construct full path
    return `${basename}${getRepoUrl({
      repo,
      scope,
      repoSubPath: repoSummaryPath
    })}`
  }

  const queryFilterValues = useMemo(
    () => ({
      favorite,
      recursive
    }),
    [favorite, recursive]
  )

  const toUpstreamRepo = useUpstreamRepoUrl()

  return (
    <SandboxRepoListPage
      scope={scope}
      useRepoStore={useRepoStore}
      isLoading={isFetching}
      isError={isError}
      errorMessage={error?.message}
      queryFilterValues={queryFilterValues}
      searchQuery={query}
      setSearchQuery={setQuery}
      setQueryPage={setQueryPage}
      onClickRepo={handleOnClickRepo}
      toRepoSummary={handleToRepoSummary}
      toCreateRepo={() => routes.toCreateRepo({ spaceId })}
      toImportRepo={() => routes.toImportRepo({ spaceId })}
      toImportMultipleRepos={() => routes.toImportMultipleRepos({ spaceId })}
      onFavoriteToggle={onFavoriteToggle}
      onCancelImport={onCancelImport}
      onFilterChange={({ favorite, recursive }: RepoListFilters) => {
        setFavorite(favorite ?? null)
        shouldResetPageRef.current = true

        if (!recursive) return

        if (accountId && orgIdentifier && projectIdentifier) return

        if (accountId && orgIdentifier) {
          setRecursive(recursive.value === ExtendedScope.OrgProg)
          shouldResetPageRef.current = true
        } else if (accountId) {
          setRecursive(recursive.value === ExtendedScope.All)
          shouldResetPageRef.current = true
        }
      }}
      onSortChange={(sortValues: string) => {
        const [type, direction] = sortValues?.split(',') || []
        const sortKey = type as ListReposQueryQueryParams['sort']
        const orderKey = direction as ListReposQueryQueryParams['order']

        setSort(sortKey)
        setOrder(orderKey)
        shouldResetPageRef.current = true
      }}
      toUpstreamRepo={toUpstreamRepo}
    />
  )
}

ReposListPage.displayName = 'ReposListPage'
