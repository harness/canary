import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { RepoRepositoryOutput, useListReposQuery } from '@harnessio/code-service-client'
import { ToastAction, useToast } from '@harnessio/ui/components'
import { RepositoryType, SandboxRepoListPage } from '@harnessio/ui/views'

import { Toaster } from '../../components-v2/toaster'
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
  const spaceURL = useGetSpaceURLParam() ?? ''
  const { setRepositories, page, setPage } = useRepoStore()
  const [importToastId, setImportToastId] = useState<string | null>(null)
  const [importedRepoData, setImportedRepoData] = useState<RepoRepositoryOutput | null>(null)
  const { toast, dismiss } = useToast()

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
      retry: 5
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

  const isRepoImporting: boolean = useMemo(() => {
    return repoData?.some(repository => repository.importing) ?? false
  }, [repoData])

  useEffect(() => {
    if (isRepoImporting && !importToastId) {
      // Show toast when import starts
      const { id } = toast({
        title: `Import in progress`,
        description: 'Your repository',
        duration: Infinity,
        action: (
          <ToastAction
            onClick={() => {
              // Add your cancel logic here
              dismiss(id)
              // setImportToastId(null)
            }}
            altText="Cancel import"
          >
            Cancel
          </ToastAction>
        )
      })
      console.log('toast id', id)
      setImportToastId(id)
    } else if (importToastId) {
      dismiss(importToastId ?? '')
      toast({
        title: 'Repository imported',
        description: `${importedRepoData?.identifier}`,
        duration: Infinity,
        action: (
          <ToastAction
            onClick={() => {
              // Add your action logic here
            }}
            altText="View"
          >
            View
          </ToastAction>
        )
      })
    }
  }, [isRepoImporting])

  const onEvent = useCallback(
    (eventData: RepoRepositoryOutput) => {
      // console.log('toast id is', importToastId)
      setImportedRepoData(eventData)

      refetch()
    },
    [refetch]
  )
  const events = useMemo(() => [SSEEvent.REPO_IMPORTED], [])

  useSpaceSSE({
    space: spaceURL,
    events,
    onEvent,
    shouldRun: true
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
