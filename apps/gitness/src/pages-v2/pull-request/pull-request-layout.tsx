import { useEffect } from 'react'

import { useGetPullReqQuery, useUpdatePullReqMutation } from '@harnessio/code-service-client'
import { useRouterContext } from '@harnessio/ui/context'
import { PullRequestLayout as PullRequestLayoutView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestStore } from './stores/pull-request-store'

const PullRequestLayout = ({ children }: { children?: React.ReactNode }) => {
  const { setPullRequest, setRefetchPullReq, setPullReqError, setPullReqLoading } = usePullRequestStore()
  const { useParams } = useRouterContext()
  const { pullRequestId, repoId } = useParams<PathParams>()
  const spaceId = useGetSpaceURLParam()

  const repoRef = useGetRepoRef()

  const {
    data: { body: pullReqData } = {},
    error: pullReqError,
    isFetching: pullReqLoading,
    refetch: refetchPullReq
  } = useGetPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId),
    queryParams: {}
  })
  const { mutateAsync: updateTitle } = useUpdatePullReqMutation({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId)
  })
  useEffect(() => {
    if (pullReqData) {
      setPullRequest(pullReqData)
      setRefetchPullReq(refetchPullReq)
      setPullReqLoading(pullReqLoading)
      setPullReqError(pullReqError)
    }
  }, [
    pullReqData,
    setPullRequest,
    setRefetchPullReq,
    refetchPullReq,
    pullReqLoading,
    pullReqError,
    setPullReqError,
    setPullReqLoading
  ])

  const handleUpdateTitle = async (title: string, description: string) => {
    await updateTitle({ body: { title, description } })
  }

  return (
    <PullRequestLayoutView
      useTranslationStore={useTranslationStore}
      usePullRequestStore={usePullRequestStore}
      spaceId={spaceId || ''}
      repoId={repoId}
      updateTitle={handleUpdateTitle}
      children={children}
    />
  )
}

export default PullRequestLayout
