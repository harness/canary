import { FC, HTMLAttributes, PropsWithChildren, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { isEqual } from 'lodash-es'

import {
  TypesPullReq,
  useFindRepositoryQuery,
  useGetPullReqQuery,
  useListCommitsQuery,
  useListPullReqActivitiesQuery
} from '@harnessio/code-service-client'
import { RepoRepositoryOutput } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSE from '../../framework/hooks/useSpaceSSE'
import useGetPullRequestTab, { PullRequestTab } from '../../hooks/useGetPullRequestTab'
import { usePRChecksDecision } from '../../pages/pull-request/hooks/usePRChecksDecision'
import { extractSpecificViolations, getCommentsInfoData } from '../../pages/pull-request/utils'
import { PathParams } from '../../RouteDefinitions'
import { SSEEvent } from '../../types'
import { normalizeGitRef } from '../../utils/git-utils'
import { PR_COMMENTS_RULES, usePullRequestProviderStore } from './stores/pull-request-provider-store'

const PullRequestDataProvider: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  const spaceURL = useGetSpaceURLParam() ?? ''
  const repoRef = useGetRepoRef()
  const { pullRequestId, spaceId, repoId } = useParams<PathParams>()
  const pullRequestTab = useGetPullRequestTab({ spaceId, repoId, pullRequestId })
  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const store = usePullRequestProviderStore()
  const {
    pullReqMetadata,
    dryMerge,
    setCommentsInfoData,
    setCommentsLoading,
    prPanelData,
    setResolvedCommentArr,
    setPullReqMetadata,
    setRepoMetadata,
    setPullReqCommits,
    pullReqCommits
  } = store

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

  const {
    data: { body: activities } = {},
    isFetching: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId),
    queryParams: {}
  })
  const {
    data: { body: commits } = {},
    error: commitsError,
    refetch: refetchCommits
  } = useListCommitsQuery({
    queryParams: {
      limit: 500,
      git_ref: normalizeGitRef(pullReqData?.source_sha),
      after: normalizeGitRef(pullReqData?.merge_base_sha)
    },
    repo_ref: repoRef
  })
  const pullReqChecksDecision = usePRChecksDecision({ repoMetadata, pullReqMetadata: pullReqData })
  const handleEvent = useCallback(
    (data: TypesPullReq) => {
      if (data && String(data?.number) === pullRequestId) {
        refetchPullReq()
      }
    },
    [pullRequestId, refetchPullReq]
  )
  useSpaceSSE({
    space: spaceURL,
    events: [SSEEvent.PULLREQ_UPDATED],
    onEvent: handleEvent,
    shouldRun: !!(spaceURL && pullRequestId) // Ensure shouldRun is true only when space and pullRequestId are valid
  })
  useEffect(() => {
    if (repoMetadata) {
      setRepoMetadata(repoMetadata as RepoRepositoryOutput)
    }
  }, [repoMetadata, setRepoMetadata])
  useEffect(() => {
    if (pullReqData && !isEqual(pullReqMetadata, pullReqData)) {
      if (
        !pullReqMetadata ||
        (pullReqMetadata &&
          (pullReqMetadata.merge_base_sha !== pullReqData.merge_base_sha ||
            pullReqMetadata.source_sha !== pullReqData.source_sha))
      ) {
        refetchCommits()
      }

      setPullReqMetadata(pullReqData)
    }
  }, [pullReqData, pullReqMetadata, setPullReqMetadata, refetchActivities, refetchCommits])

  useEffect(() => {
    const hasChanges =
      !isEqual(store.pullReqMetadata, pullReqData) ||
      !isEqual(store.pullReqCommits, commits) ||
      !isEqual(store.pullReqActivities, activities)

    if (hasChanges) {
      setResolvedCommentArr(undefined)
      store.updateState({
        repoMetadata: repoMetadata as RepoRepositoryOutput,
        setPullReqMetadata,
        pullReqMetadata: pullReqData ? pullReqData : undefined,
        pullReqCommits: commits,
        pullReqActivities: activities,
        loading: pullReqLoading || activitiesLoading,
        error: pullReqError || activitiesError || commitsError,
        pullReqChecksDecision,
        refetchActivities,
        refetchCommits,
        refetchPullReq,
        retryOnErrorFunc: () => {
          if (pullReqError) {
            refetchPullReq()
          } else if (commitsError) {
            refetchCommits()
          } else {
            refetchActivities()
          }
        },
        prPanelData: {
          ...prPanelData,
          resolvedCommentArr: undefined,
          commentsInfoData: prPanelData?.commentsInfoData
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    repoMetadata,
    pullReqData,
    commits,
    activities,
    pullReqLoading,
    activitiesLoading,
    pullReqError,
    activitiesError,
    commitsError,
    prPanelData,
    pullReqChecksDecision,
    refetchActivities,
    refetchCommits,
    refetchPullReq,
    setCommentsInfoData,
    setResolvedCommentArr
  ])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (pullReqMetadata?.source_sha && pullRequestTab === PullRequestTab.CONVERSATION && repoRef) {
        dryMerge()
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pullReqMetadata?.source_sha, pullRequestTab, repoRef])

  useEffect(() => {
    if (repoRef && pullReqData?.source_sha) {
      // store.updateState({ prPanelData: { ...prPanelData, PRStateLoading: true } })
      dryMerge()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoRef, pullReqData?.source_sha, pullRequestTab])

  useEffect(() => {
    setCommentsInfoData(
      getCommentsInfoData({
        requiresCommentApproval: prPanelData.requiresCommentApproval,
        resolvedCommentArrParams: prPanelData.resolvedCommentArr?.params
      })
    )
    setCommentsLoading(false)
  }, [
    prPanelData.requiresCommentApproval,
    prPanelData.resolvedCommentArr?.params,
    setCommentsInfoData,
    setCommentsLoading
  ])

  useEffect(() => {
    if (commits && !isEqual(commits, pullReqCommits)) {
      setPullReqCommits(commits)
    }
  }, [commits, pullReqCommits, setPullReqCommits])

  useEffect(() => {
    const ruleViolationArr = prPanelData.ruleViolationArr

    const requireResCommentRule = extractSpecificViolations(ruleViolationArr, PR_COMMENTS_RULES.REQUIRE_RESOLVE_ALL)
    setResolvedCommentArr(requireResCommentRule?.[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prPanelData.ruleViolationArr, pullReqMetadata, repoMetadata, prPanelData.ruleViolation])

  return <>{children}</>
}

export default PullRequestDataProvider
