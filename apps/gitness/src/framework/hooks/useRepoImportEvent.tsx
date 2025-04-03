import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RepoRepositoryOutput } from '@harnessio/code-service-client'
import { useToast } from '@harnessio/ui/components'

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
        title: 'Successfully imported',
        description: (
          <Link
            className="text-cn-foreground-accent hover:underline"
            to={routes.toRepoSummary({ spaceId, repoId: importRepoIdentifier ?? '' })}
          >
            {importRepoIdentifier}
          </Link>
        ),
        action: null,
        duration: 5000,
        variant: 'success'
      })
      const transformedRepo = transformRepoList([eventData])
      updateRepository(transformedRepo[0])
      setImportRepoIdentifier(null)
      setImportToastId(null)
    },
    [importToastId]
  )
  const onError = useCallback(() => {
    update({
      id: importToastId ?? '',
      title: 'Import failed',
      variant: 'failed',
      action: null
    })
  }, [importToastId])
  const events = useMemo(() => [SSEEvent.REPO_IMPORTED], [])

  useSpaceSSE({
    space: spaceURL,
    events,
    onEvent,
    onError,
    shouldRun: true
  })
}
