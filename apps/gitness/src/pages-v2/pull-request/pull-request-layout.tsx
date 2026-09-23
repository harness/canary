import { useEffect, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'

import { capitalize } from 'lodash-es'

import {
  useChangeTargetBranchMutation,
  useGetPullReqQuery,
  useUpdatePullReqMutation
} from '@harnessio/code-service-client'
import { PullRequestLayout as PullRequestLayoutView } from '@harnessio/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { usePageTitleContext } from '../../framework/context/PageTitleContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useGetPullRequestTab from '../../hooks/useGetPullRequestTab'
import { useUpstreamRepoUrl } from '../../hooks/useUpstreamRepoUrl'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestStore } from './stores/pull-request-store'
import { matchesPullRequestId } from './utils/pull-request-identity'

const PullRequestLayout = () => {
  const { setPullRequest, setRefetchPullReq, setPullReqError, setPullReqLoading, reset } = usePullRequestStore()

  const { pullRequestId, spaceId, repoId } = useParams<PathParams>()

  const repoRef = useGetRepoRef()
  const { setPageTitle } = usePageTitleContext()
  const toUpstreamRepo = useUpstreamRepoUrl()

  const {
    data: { body: pullReqData } = {},
    error: pullReqError,
    isFetching: pullReqLoading,
    refetch: refetchPullReq
  } = useGetPullReqQuery(
    {
      repo_ref: repoRef,
      pullreq_number: Number(pullRequestId),
      queryParams: {}
    },
    // repoRef is empty until the scope resolves. Firing before then requests `/repos//+/...`,
    // and with `retry: false` on the query client that failure stays in the cache.
    { enabled: !!repoRef && Number.isFinite(Number(pullRequestId)) }
  )

  const pullRequestTab = useGetPullRequestTab({ spaceId, repoId, pullRequestId })

  useLayoutEffect(() => {
    const stored = usePullRequestStore.getState().pullRequest
    if (stored && !matchesPullRequestId(stored.number, pullRequestId)) {
      reset()
    }
  }, [pullRequestId, reset])

  useEffect(() => {
    if (!pullReqData && !pullRequestTab) return

    /**
     * Constructs document title in the format:
     * "Pull Request Title (#123) | Conversation"
     */
    const { title, number } = pullReqData ?? {}
    const pageTitle = [title, number ? `(#${number})` : null].filter(Boolean).join(' ')
    const finalTitle = [pageTitle, capitalize(pullRequestTab || '')].filter(Boolean).join(' | ')

    setPageTitle(finalTitle)
  }, [pullReqData, pullRequestTab])

  const { mutateAsync: updateTitle } = useUpdatePullReqMutation(
    {
      repo_ref: repoRef,
      pullreq_number: Number(pullRequestId)
    },
    {
      onSuccess: () => {
        refetchPullReq()
      }
    }
  )
  const { mutateAsync: updateTargetBranch } = useChangeTargetBranchMutation(
    {
      repo_ref: repoRef,
      pullreq_number: Number(pullRequestId)
    },
    {
      onSuccess: () => {
        refetchPullReq()
      }
    }
  )
  useEffect(() => {
    setRefetchPullReq(refetchPullReq)
    setPullReqLoading(pullReqLoading)
    setPullReqError(pullReqError ?? null)

    // Only overwrite on success, so a background refetch doesn't blank the header.
    // Skip payloads that aren't this route — a reset in layoutEffect can race this effect.
    if (pullReqData && matchesPullRequestId(pullReqData.number, pullRequestId)) {
      setPullRequest(pullReqData)
    }
  }, [
    pullReqData,
    setPullRequest,
    setRefetchPullReq,
    refetchPullReq,
    pullReqLoading,
    pullReqError,
    setPullReqError,
    setPullReqLoading,
    pullRequestId
  ])

  const handleUpdateTitleAndDescription = (title: string, description: string) => {
    updateTitle({ body: { title, description } })
  }

  const handleUpdateTargetBranch = (branchName: string) => {
    if (branchName) {
      updateTargetBranch({ body: { branch_name: branchName } })
    }
  }

  return (
    <PullRequestLayoutView
      usePullRequestStore={usePullRequestStore}
      spaceId={spaceId || ''}
      repoId={repoId}
      updateTitleAndDescription={handleUpdateTitleAndDescription}
      updateTargetBranch={handleUpdateTargetBranch}
      branchSelectorRenderer={BranchSelectorContainer}
      toUpstreamRepo={toUpstreamRepo}
    />
  )
}

PullRequestLayout.displayName = 'PullRequestLayout'
export default PullRequestLayout
