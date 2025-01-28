import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@harnessio/canary'
import { ListReposOkResponse, useListReposQuery } from '@harnessio/code-service-client'
import { StyledLink, toast, Toaster } from '@harnessio/ui/components'
import { RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useQueryState } from '../../framework/hooks/useQueryState'
import useSpaceSSE from '../../framework/hooks/useSpaceSSE'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader, SSEEvent } from '../../types'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

export default function ReposListPage() {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const dismissFirstToastRef = useRef<(() => void) | null>(null)

  const spaceURL = useGetSpaceURLParam() ?? ''
  const { setRepositories, page, setPage } = useRepoStore()
  const [startImport, setStartImport] = useState(false)

  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const {
    data: { body: repoData, headers } = {},
    refetch,
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

  const isRepoStillImporting: boolean = useMemo(() => {
    return repoData?.some(repository => repository.importing) ?? false
  }, [repoData])

  const onEvent = useCallback(
    (_eventRepos: ListReposOkResponse) => {
      if (repoData?.some(repository => repository.importing)) {
        refetch()
        setStartImport(true)
      }
    },
    [repoData, refetch]
  )

  useEffect(() => {
    const { id, update, dismiss } = toast({
      title: 'Import in progress',
      description: 'Your repository is being imported',
      // duration: ,
      action: <Button onClick={() => {}}>Cancel</Button>
    })

    if (!isRepoStillImporting) {
      console.log('here')
      dismiss()
    }

    if (!isRepoStillImporting && startImport) {
      dismiss()
      toast({
        // id: id,
        title: 'Import complete',
        description: 'Repository imported successfully',
        duration: Infinity,
        action: <StyledLink to="/">Go to repo</StyledLink>
      })
      setStartImport(false)
    }
  }, [isRepoStillImporting])

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
      <Toaster />
    </>
  )
}
