import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@harnessio/canary'
import {
  ListReposOkResponse,
  RepoRepositoryOutput,
  useDeleteRepositoryMutation,
  useListReposQuery
} from '@harnessio/code-service-client'
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
  const [importingRepo, setImportingRepo] = useState<RepoRepositoryOutput[] | null>(null)

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

  const deleteRepository = async (spaceId: string, repoId: string) => {
    try {
      const response = await fetch(`/api/v1/repos/${spaceId}/${repoId}/+/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to delete repository. Status: ${response.status}`)
      }
      setImportingRepo(null)
      if (dismissFirstToastRef.current) {
        dismissFirstToastRef.current()
        dismissFirstToastRef.current = null
      }

      refetch() // Refetch repositories after deletion
    } catch (error) {
      console.error('Error deleting repository:', error)
    }
  }
  // const { mutate: deleteRepo } = useDeleteRepositoryMutation({})

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
    if (repoData) {
      // Filter repositories that are importing
      const importingRepos = repoData.filter(repository => repository.importing)
      // Update state with importing repositories
      if (importingRepos.length > 0) setImportingRepo(importingRepos)
      // Return true if any repository is importing
      console.log(importingRepos)
      return importingRepos.length > 0
    }
    // setImportingRepo(null)
    return false
  }, [repoData])

  const onEvent = useCallback(
    (_eventRepos: ListReposOkResponse) => {
      if (repoData?.some(repository => repository.importing)) {
        refetch()
      }
    },
    [repoData, refetch]
  )

  useEffect(() => {
    if (isRepoStillImporting) {
      const { dismiss } = toast({
        title: `Import for ${importingRepo?.[0].identifier} in progress`,
        description: 'Your repository is being imported',
        duration: isRepoStillImporting ? Infinity : -Infinity,
        action: (
          <Button onClick={() => deleteRepository(spaceId ?? '', importingRepo?.[0].identifier ?? '')}>Cancel</Button>
        )
      })
      dismissFirstToastRef.current = dismiss
    }
    if (!isRepoStillImporting && importingRepo != null) {
      console.log(!isRepoStillImporting, importingRepo)
      if (dismissFirstToastRef.current) {
        dismissFirstToastRef.current()
        dismissFirstToastRef.current = null
      }
      toast({
        // id: id,
        title: 'Import complete',
        description: 'Repository imported successfully',
        duration: Infinity,
        action: <StyledLink to={`${importingRepo?.[0].identifier}/summary`}>Go to repo</StyledLink>
      })
      // setStartImport(false)
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
