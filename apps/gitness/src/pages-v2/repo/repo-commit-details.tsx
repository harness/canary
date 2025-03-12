import { useEffect } from 'react'

import { useGetCommitQuery } from '@harnessio/code-service-client'
import { useRouterContext } from '@harnessio/ui/context'
import { RepoCommitDetailsView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useCommitDetailsStore } from './stores/commit-details-store'

export default function RepoCommitDetailsPage({ showSidebar = true }: { showSidebar?: boolean }) {
  const repoRef = useGetRepoRef()
  const { useParams } = useRouterContext()
  const { repoId, commitSHA } = useParams<PathParams>()
  const { setCommitData } = useCommitDetailsStore()
  const routes = useRoutes()
  const spaceId = useGetSpaceURLParam()
  const { data: { body: commitData } = {} } = useGetCommitQuery({
    repo_ref: repoRef,
    commit_sha: commitSHA || ''
  })

  useEffect(() => {
    if (commitData) {
      setCommitData(commitData)
    }
  }, [commitData, setCommitData])

  return (
    <RepoCommitDetailsView
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      useCommitDetailsStore={useCommitDetailsStore}
      useTranslationStore={useTranslationStore}
      showSidebar={showSidebar}
    />
  )
}
