import { useCallback, useMemo } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

import { RepoRepositoryOutput } from '@harnessio/code-service-client'
import { RepoSubheader, Toast, ToastAction, useToast } from '@harnessio/ui/components'

import { Toaster } from '../../components-v2/toaster'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import useSpaceSSE from '../../framework/hooks/useSpaceSSE'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { SSEEvent } from '../../types'
import { useRepoStore } from './stores/repo-list-store'
import { transformRepoList } from './transform-utils/repo-list-transform'

const RepoLayout = () => {
  const isMFE = useIsMFE()
  const { update } = useToast()
  const routes = useRoutes()
  const { importToastId, importRepoIdentifier, setImportRepoIdentifier, setImportToastId, updateRepository } =
    useRepoStore()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''

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
      // addRepository(transformedRepo[0])
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

  return (
    <>
      <div className="layer-high sticky top-[55px] bg-background-1">
        <RepoSubheader showPipelinesTab={!isMFE} useTranslationStore={useTranslationStore} />
      </div>
      {/* <div className="absolute bottom-0 right-0"> */}
      <Toaster />
      {/* </div> */}
      <Outlet />
    </>
  )
}

export default RepoLayout
