import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useDeleteRepositoryMutation, useListReposQuery } from '@harnessio/code-service-client'
import { Pagination, Toast, useToast } from '@harnessio/ui/components'
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
    setImportToastId,
    totalItems,
    pageSize
  } = useRepoStore()
  const { toast, dismiss } = useToast()

  const [query, setQuery] = useQueryState('query')
  const { queryPage, setQueryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const { t } = useTranslationStore()

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
    const perPage = parseInt(headers?.get(PageResponseHeader.xPerPage) || '0')
    if (repoData) {
      const transformedRepos = transformRepoList(repoData)
      setRepositories(transformedRepos, totalItems, perPage)
    } else {
      setRepositories([], totalItems, perPage)
    }
  }, [repoData, headers, setRepositories])

  // const isRepoImporting: boolean = useMemo(() => {
  //   return repoData?.some(repository => repository.importing) ?? false
  // }, [repoData])

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')

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

  const getPrevPageLink = () => {
    return `?page=${page - 1}`
  }

  const getNextPageLink = () => {
    return `?page=${page + 1}`
  }

  const getPageLink = (page: number) => {
    return `?page=${page}`
  }

  console.log('spaceURL', spaceURL)

  return (
    <>
      <h1 style={{ marginTop: '10rem', textAlign: 'center' }}>Determinate Pagination</h1>

      <Pagination
        currentPage={page}
        truncateLimit={3}
        goToPage={setPage}
        t={t}
        totalItems={totalItems}
        pageSize={pageSize}
      />

      <h1 style={{ marginTop: '10rem', textAlign: 'center' }}>Determinate Pagination with link</h1>

      <Pagination currentPage={page} getPageLink={getPageLink} t={t} totalItems={totalItems} pageSize={pageSize} />

      <h1 style={{ marginTop: '10rem', textAlign: 'center' }}>Indeterminate Pagination</h1>
      <Pagination
        indeterminate
        hasNext={page < totalPages}
        hasPrevious={page > 1}
        getPrevPageLink={getPrevPageLink}
        getNextPageLink={getNextPageLink}
        t={t}
      />
      <SandboxRepoListPage
        useRepoStore={useRepoStore}
        useTranslationStore={useTranslationStore}
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
      />
    </>
  )
}

ReposListPage.displayName = 'ReposListPage'
