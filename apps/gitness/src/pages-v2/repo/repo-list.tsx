import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RepoRepositoryOutput, useDeleteRepositoryMutation, useListReposQuery } from '@harnessio/code-service-client'
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
  const { setRepositories, page, setPage, importRepoIdentifier, setImportRepoIdentifier, addRepository } =
    useRepoStore()
  const [importToastId, setImportToastId] = useState<string | null>(null)
  const { toast, dismiss, update } = useToast()

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
    const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    if (repoData) {
      const transformedRepos = transformRepoList(repoData)
      setRepositories(transformedRepos, totalPages)
    } else {
      setRepositories([], totalPages)
    }
  }, [repoData, headers, setRepositories])

  // const isRepoImporting: boolean = useMemo(() => {
  //   return repoData?.some(repository => repository.importing) ?? false
  // }, [repoData])

  useEffect(() => {
    if (importRepoIdentifier && !importToastId) {
      const { id } = toast({
        title: `Import in progress`,
        description: importRepoIdentifier,
        duration: Infinity,
        action: (
          <ToastAction
            onClick={() => {
              deleteRepository({
                queryParams: {},
                repo_ref: `${spaceURL}/${importRepoIdentifier}/+`
              })
            }}
            altText="Cancel import"
          >
            {isCancellingImport ? 'Canceling...' : 'Cancel'}
          </ToastAction>
        )
      })
      setImportToastId(id)
    }
  }, [importRepoIdentifier, setImportRepoIdentifier])

  const onEvent = useCallback(
    (eventData: RepoRepositoryOutput) => {
      update({
        id: importToastId ?? '',
        title: 'Repository imported',
        description: importRepoIdentifier,
        duration: 5000,
        action: (
          <Link to={routes.toRepoSummary({ spaceId, repoId: importRepoIdentifier ?? '' })}>
            <ToastAction altText="View repository">View</ToastAction>
          </Link>
        ),
        variant: 'success'
      })
      const transformedRepo = transformRepoList([eventData])
      addRepository(transformedRepo[0])
      setImportRepoIdentifier(null)
    },
    [importToastId]
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
