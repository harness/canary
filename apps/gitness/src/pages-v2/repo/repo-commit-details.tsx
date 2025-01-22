import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useGetCommitQuery } from '@harnessio/code-service-client'
import { RepoCommitDetailsView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useCommitDetailsStore } from './stores/commit-details-store'

export default function RepoCommitDetailsPage({ showSidebar = true }: { showSidebar?: boolean }) {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()
  const { setCommitData } = useCommitDetailsStore()
  const routes = useRoutes()
  const { repoId, spaceId } = useParams<PathParams>()
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
