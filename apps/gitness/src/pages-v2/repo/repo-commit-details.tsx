import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useGetCommitQuery } from '@harnessio/code-service-client'
import { RepoCommitDetailsView } from '@harnessio/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { useCommitDetailsStore } from './stores/commit-details-store'

export default function RepoCommitDetailsPage() {
  const repoRef = useGetRepoRef()
  const { commitSHA } = useParams<PathParams>()
  const { setCommitData } = useCommitDetailsStore()
  const routes = useRoutes()
  const { repoId, spaceId } = useParams<PathParams>()
  const { data: { body: commitData } = {}, isLoading: loadingCommitDetails } = useGetCommitQuery({
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
      toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
      toPullRequest={({ pullRequestId }: { pullRequestId: number }) =>
        routes.toPullRequest({ spaceId, repoId, pullRequestId: pullRequestId.toString() })
      }
      useCommitDetailsStore={useCommitDetailsStore}
      loadingCommitDetails={loadingCommitDetails}
    />
  )
}
