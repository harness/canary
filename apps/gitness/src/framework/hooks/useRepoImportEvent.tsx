import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RepoRepositoryOutput } from '@harnessio/code-service-client'
import { ToastAction, useToast } from '@harnessio/ui/components'

import { useRepoStore } from '../../pages-v2/repo/stores/repo-list-store'
import { transformRepoList } from '../../pages-v2/repo/transform-utils/repo-list-transform'
import { PathParams } from '../../RouteDefinitions'
import { SSEEvent } from '../../types'
import { useRoutes } from '../context/NavigationContext'
import { useGetSpaceURLParam } from './useGetSpaceParam'
import useSpaceSSE from './useSpaceSSE'

export const useRepoImportEvents = () => {
  const { update } = useToast()
  const routes = useRoutes()
  const { importToastId, importRepoIdentifier, setImportRepoIdentifier, setImportToastId, updateRepository } =
    useRepoStore()
  const spaceURL = useGetSpaceURLParam() ?? ''
  const { spaceId } = useParams<PathParams>()

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
      updateRepository(transformedRepo[0])
      setImportRepoIdentifier(null)
      setImportToastId(null)
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
}
