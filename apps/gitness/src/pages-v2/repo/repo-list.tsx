import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { ListReposOkResponse, useListReposQuery } from '@harnessio/code-service-client'
import { RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSE from '../../framework/hooks/useSpaceSSE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader, SSEEvent } from '../../types'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

export default function ReposListPage() {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''
  const { setRepositories, page, setPage } = useRepoStore()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const {
    data: { body: repoData, headers } = {},
    refetch,
    isFetching,
    isError,
    error
  } = useListReposQuery(
    {
      queryParams: { page, query: query ?? '' },
      space_ref: `${spaceURL}/+`
    },
    {
      retry: false
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
    setQueryPage(page)
  }, [queryPage, page, setPage])

  const isRepoStillImporting: boolean = useMemo(() => {
    return repoData?.some(repository => repository.importing) ?? false
  }, [repoData])

  const onEvent = useCallback(
    (_eventRepos: ListReposOkResponse) => {
      if (repoData?.some(repository => repository.importing)) {
        refetch()
      }
    },
    [repoData]
  )

  const events = useMemo(() => [SSEEvent.REPO_IMPORTED], [])

  useSpaceSSE({
    space: spaceURL,
    events,
    onEvent,
    shouldRun: isRepoStillImporting
  })

  return (
    <>
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
    </>
  )
}
