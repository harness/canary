import { useCallback, useEffect, useMemo } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { ListReposOkResponse, useListReposQuery } from '@harnessio/code-service-client'
import { SandboxRepoListPage } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSE from '../../framework/hooks/useSpaceSSE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { timeAgoFromEpochTime } from '../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader, SSEEvent } from '../../types'
import { useRepoStore } from './stores/repo-list-store'

export default function ReposListPage() {
  const space = useGetSpaceURLParam() ?? ''
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
      space_ref: `${space}/+`
    },
    {
      retry: false
    }
  )

  useEffect(() => {
    const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    if (repoData) {
      const transformedRepos = repoData.map(repo => ({
        id: repo.id || 0,
        name: repo.identifier || '',
        description: repo.description || '',
        private: !repo.is_public,
        stars: 0,
        forks: repo.num_forks || 0,
        pulls: repo.num_pulls || 0,
        timestamp: repo.updated ? timeAgoFromEpochTime(repo.updated) : '',
        createdAt: repo.created || 0,
        importing: !!repo.importing
      }))
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
    space,
    events,
    onEvent,
    shouldRun: isRepoStillImporting
  })

  return (
    <>
      <Breadcrumbs />
      <SandboxRepoListPage
        useRepoStore={useRepoStore}
        useTranslationStore={useTranslationStore}
        isLoading={isFetching}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
    </>
  )
}
