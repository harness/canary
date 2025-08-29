import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { capitalize } from 'lodash-es'

import {
  useChangeTargetBranchMutation,
  useGetPullReqQuery,
  useUpdatePullReqMutation
} from '@harnessio/code-service-client'
import { PullRequestLayout as PullRequestLayoutView } from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { usePageTitleContext } from '../../framework/context/PageTitleContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useGetPullRequestTab from '../../hooks/useGetPullRequestTab'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'
import { usePullRequestStore } from './stores/pull-request-store'

const PullRequestLayout = () => {
  const { setPullRequest, setRefetchPullReq, setPullReqError, setPullReqLoading } = usePullRequestStore()
  const { setPullReqMetadata } = usePullRequestProviderStore()

  const { pullRequestId, spaceId, repoId } = useParams<PathParams>()

  const repoRef = useGetRepoRef()
  const { setPageTitle } = usePageTitleContext()

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

  const pullRequestTab = useGetPullRequestTab({ spaceId, repoId, pullRequestId })

  useEffect(() => {
    return () => {
      setPullReqMetadata(undefined)
    }
  }, [setPullReqMetadata])

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
    />
  )
}

PullRequestLayout.displayName = 'PullRequestLayout'
export default PullRequestLayout
