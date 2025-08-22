import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { RepoRepositoryOutput } from '@harnessio/code-service-client'
import { Link, useToast } from '@harnessio/ui/components'

import { useRepoStore } from '../../pages-v2/repo/stores/repo-list-store'
import { transformRepoList } from '../../pages-v2/repo/transform-utils/repo-list-transform'
import { PathParams } from '../../RouteDefinitions'
import { SSEEvent } from '../../types'
import { useRoutes } from '../context/NavigationContext'
import { eventManager } from '../event/EventManager'

export const useRepoImportWithPubSub = () => {
  const { update, toast } = useToast()
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()

  const handleImportEvent = useCallback(
    (eventData: RepoRepositoryOutput) => {
      const { importToastId, importRepoIdentifier, setImportRepoIdentifier, setImportToastId, updateRepository } =
        useRepoStore.getState()

      if (importToastId && importRepoIdentifier && importRepoIdentifier === eventData.identifier) {
        try {
          update({
            id: importToastId,
            open: false
          })
        } catch (error) {
          console.error('No toast to dismiss:', error)
        }

        toast({
          title: 'Successfully imported',
          description: (
            <Link to={routes.toRepoSummary({ spaceId, repoId: importRepoIdentifier })}>{importRepoIdentifier}</Link>
          ),
          action: null,
          duration: 5000,
          variant: 'success'
        })

        const transformedRepo = transformRepoList([eventData])
        updateRepository(transformedRepo[0])

        setImportRepoIdentifier(null)
        setImportToastId(null)
      }
    },
    [routes, spaceId, toast, update]
  )

  const handleError = useCallback(() => {
    const { importToastId } = useRepoStore.getState()

    if (importToastId) {
      update({
        id: importToastId,
        title: 'Import failed',
        variant: 'failed',
        action: null
      })
    }
  }, [update])

  useEffect(() => {
    eventManager.subscribe(SSEEvent.REPO_IMPORTED, handleImportEvent)
    eventManager.subscribe('error', handleError)

    // We're not unsubscribing because we want these handlers to persist across navigation
    // This aligns with the provider-based architecture for SSE connections where the
    // EventManager singleton handles pub-sub event distribution independently of component lifecycle
    return undefined
  }, [handleImportEvent, handleError])
}
