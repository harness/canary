import { useCallback, useEffect, useMemo, useState } from 'react'
import { Spacer } from '@harnessio/canary'
import {
  commentCreatePullReq,
  commentStatusPullReq,
  EnumCheckStatus,
  EnumMergeMethod,
  mergePullReqOp,
  OpenapiMergePullReq,
  reviewerAddPullReq,
  reviewerDeletePullReq,
  TypesPullReqActivity,
  TypesPullReqReviewer,
  useCodeownersPullReqQuery,
  useListPrincipalsQuery,
  useListPullReqActivitiesQuery,
  useReviewerListPullReqQuery
} from '@harnessio/code-service-client'
import {
  SandboxLayout,
  PullRequestCommentBox,
  PullRequestFilters,
  PullRequestOverview,
  PullRequestPanel,
  PullRequestSideBar,
  SkeletonList
} from '@harnessio/views'
import { useDateFilters } from './hooks/useDataFilters'
import { useActivityFilters } from './hooks/useActivityFilters'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import {
  capitalizeFirstLetter,
  checkIfOutdatedSha,
  extractInfoForCodeOwnerContent,
  findChangeReqDecisions,
  findWaitingDecisions,
  generateAlphaNumericHash,
  processReviewDecision
} from './utils'
import { useParams } from 'react-router-dom'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestData } from './context/pull-request-data-provider'
import { isEmpty } from 'lodash-es'
import { CodeOwnerReqDecision } from '../../types'
import { useAppContext } from '../../framework/context/AppContext'

export default function PullRequestConversationPage() {
  const {
    refetchActivities,
    refetchPullReq,
    pullReqMetadata,
    pullReqChecksDecision,
    prPanelData,
    setRuleViolationArr,
    loading: prLoading
  } = usePullRequestData()
  const { currentUser: currentUserData } = useAppContext()
  const [checkboxBypass, setCheckboxBypass] = useState(false)
  const { spaceId, repoId } = useParams<PathParams>()
  const { data: { body: principals } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user' }
  })
  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  // const [loadState, setLoadState] = useState('data-loaded')
  const dateFilters = useDateFilters()
  const [dateOrderSort, setDateOrderSort] = useState<{ label: string; value: string }>(dateFilters[0])
  const activityFilters = useActivityFilters()
  const [activityFilter, setActivityFilter] = useState<{ label: string; value: string }>(activityFilters[0])
  const { data: { body: reviewers } = {}, refetch: refetchReviewers } = useReviewerListPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })
  const { data: { body: codeOwners } = {}, refetch: refetchCodeOwners } = useCodeownersPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })
  const { data: { body: activityData } = {} } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })
  const [changesLoading, setChangesLoading] = useState(true)

  const [activities, setActivities] = useState(activityData)
  const approvedEvaluations = reviewers?.filter(evaluation => evaluation.review_decision === 'approved')
  const latestApprovalArr = approvedEvaluations?.filter(
    approved => !checkIfOutdatedSha(approved.sha, pullReqMetadata?.source_sha as string)
  )
  const changeReqEvaluations = reviewers?.filter(evaluation => evaluation.review_decision === 'changereq')
  const changeReqReviewer =
    changeReqEvaluations && !isEmpty(changeReqEvaluations)
      ? capitalizeFirstLetter(
          changeReqEvaluations[0].reviewer?.display_name || changeReqEvaluations[0].reviewer?.uid || ''
        )
      : 'Reviewer'
  const codeOwnerChangeReqEntries = findChangeReqDecisions(
    codeOwners?.evaluation_entries,
    CodeOwnerReqDecision.CHANGEREQ
  )
  const codeOwnerPendingEntries = findWaitingDecisions(codeOwners?.evaluation_entries)
  const codeOwnerApprovalEntries = findChangeReqDecisions(codeOwners?.evaluation_entries, CodeOwnerReqDecision.APPROVED)
  const latestCodeOwnerApprovalArr = codeOwnerApprovalEntries
    ?.map(entry => {
      // Filter the owner_evaluations for 'changereq' decisions
      const entryEvaluation = entry?.owner_evaluations.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (evaluation: any) => !checkIfOutdatedSha(evaluation?.review_sha, pullReqMetadata?.source_sha as string)
      )
      // If there are any 'changereq' decisions, return the entry along with them
      if (entryEvaluation && entryEvaluation?.length > 0) {
        return { entryEvaluation }
      }
    }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((entry: any) => entry !== null && entry !== undefined) // Filter out the null entries

  useEffect(() => {
    refetchCodeOwners()
  }, [pullReqMetadata, pullReqMetadata?.title, pullReqMetadata?.state, pullReqMetadata?.source_sha, refetchCodeOwners])

  // If you need to update activities when activityData changes, use useEffect
  useEffect(() => {
    setActivities(activityData)
  }, [activityData])
  const currentUser = useMemo(() => currentUserData?.display_name, [currentUserData?.display_name])

  let count = generateAlphaNumericHash(5)
  const handleSaveComment = (comment: string, parentId?: number) => {
    // Create a temporary comment object

    const newComment: TypesPullReqActivity = {
      id: parentId, // Temporary ID
      author: { display_name: currentUser }, // Replace with actual user data
      created: Date.now(),
      edited: Date.now(),
      updated: Date.now(),
      deleted: 0,
      code_comment: undefined,
      text: comment,
      payload: {
        message: comment,
        parent_id: parentId,
        author: { display_name: currentUser },
        id: count, // Temporary ID
        created: Date.now(),
        edited: Date.now(),
        updated: Date.now(),
        deleted: 0,
        code_comment: undefined,
        text: comment
      }
    }
    count = count + 1

    // Update the state locally
    // setActivities(prevData => [...(prevData || []), newComment])

    // Persist the new comment to the API
    commentCreatePullReq({ repo_ref: repoRef, pullreq_number: prId, body: { text: comment, parent_id: parentId } })
      .then(() => {
        refetchActivities()
        // TODO: set response after saving the comment to update the local state with the new comment data
        // Update the state with the response from the API
        // setMockActivities(prevData => prevData.map(item => (item.id === newComment.id ? response.data : item)))
      })
      .catch(error => {
        // Handle error (e.g., remove the temporary comment or show an error message)
        setActivities(prevData => prevData?.filter(item => item.id !== newComment.id))
        console.error('Failed to save comment:', error)
      })
  }

  const changesInfo = extractInfoForCodeOwnerContent({
    approvedEvaluations,
    reqNoChangeReq: prPanelData?.atLeastOneReviewerRule,
    reqCodeOwnerApproval: prPanelData?.reqCodeOwnerApproval,
    minApproval: prPanelData?.minApproval,
    reqCodeOwnerLatestApproval: prPanelData?.reqCodeOwnerLatestApproval,
    minReqLatestApproval: prPanelData?.minReqLatestApproval,
    codeOwnerChangeReqEntries,
    codeOwnerPendingEntries,
    latestCodeOwnerApprovalArr,
    latestApprovalArr,
    codeOwnerApprovalEntries,
    changeReqReviewer,
    changeReqEvaluations
  })
  useEffect(() => {
    if (
      !prPanelData?.PRStateLoading &&
      changesInfo?.title !== '' &&
      changesInfo?.statusMessage !== '' &&
      changesInfo?.statusIcon !== ''
    ) {
      setChangesLoading(false)
    } else if (pullReqMetadata?.merged) {
      setChangesLoading(false)
    }
  }, [changesInfo, prPanelData, pullReqMetadata?.merged])
  const handleAddReviewer = (id?: number) => {
    reviewerAddPullReq({ repo_ref: repoRef, pullreq_number: prId, body: { reviewer_id: id } })
      .then(() => {
        refetchReviewers()
      })
      .catch(exception => console.warn(exception))
  }
  const handleDeleteReviewer = (id: number) => {
    reviewerDeletePullReq({ repo_ref: repoRef, pullreq_number: prId, pullreq_reviewer_id: id })
      .then(() => {
        refetchReviewers()
      })
      .catch(exception => console.warn(exception))
  }
  const onPRStateChanged = useCallback(() => {
    refetchCodeOwners()
    refetchPullReq()
    refetchActivities()
  }, [refetchCodeOwners, repoRef, handleAddReviewer, handleDeleteReviewer]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMerge = (method: string) => {
    const payload: OpenapiMergePullReq = {
      method: method as EnumMergeMethod,
      source_sha: pullReqMetadata?.source_sha,
      bypass_rules: checkboxBypass,
      dry_run: false
      // message: data.commitMessage
    }
    mergePullReqOp({ body: payload, repo_ref: repoRef, pullreq_number: prId }).then(() => {
      onPRStateChanged()
      setRuleViolationArr(undefined)
    })
    //todo: add catch t o show errors
    // .catch(exception => showError(getErrorMessage(exception)))
  }
  const mockPullRequestActions = [
    {
      id: '0',
      title: 'Squash and merge',
      description: 'All commits from this branch will be combined into one commit in the base branch.',
      action: () => {
        handleMerge('squash')
      }
    },
    {
      id: '1',
      title: 'Merge pull request',
      description: 'All commits from this branch will be added to the base branch via a merge commit.',
      action: () => {
        handleMerge('merge')
      }
    },
    {
      id: '2',
      title: 'Rebase and merge',
      description: 'All commits from this branch will be rebased and added to the base branch.',
      action: () => {
        handleMerge('rebase')
      }
    }
  ]
  if (prLoading || prPanelData?.PRStateLoading || changesLoading) {
    return <SkeletonList />
  }
  return (
    <>
      <SandboxLayout.Columns columnWidths="1fr 220px">
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pl-0">
            {/* TODO: fix handleaction for comment section in panel */}
            <PullRequestPanel
              spaceId={spaceId}
              repoId={repoId}
              changesInfo={{
                header: changesInfo?.title,
                content: changesInfo?.statusMessage,
                status: changesInfo?.statusIcon
              }}
              checksInfo={{
                header: pullReqChecksDecision.checkInfo.title,
                content: pullReqChecksDecision.summaryText,
                status: pullReqChecksDecision?.checkInfo.status as EnumCheckStatus
              }}
              commentsInfo={prPanelData?.commentsInfoData}
              ruleViolation={prPanelData.ruleViolation}
              checks={pullReqChecksDecision?.data?.checks}
              PRStateLoading={prPanelData?.PRStateLoading || prLoading}
              // TODO: TypesPullReq is null for someone: vardan will look into why swagger is doing this
              pullReqMetadata={pullReqMetadata ? pullReqMetadata : undefined}
              // TODO: add dry merge check into pr context
              conflictingFiles={prPanelData?.conflictingFiles}
              approvedEvaluations={approvedEvaluations}
              changeReqEvaluations={changeReqEvaluations}
              codeOwners={codeOwners}
              latestApprovalArr={latestApprovalArr}
              reqNoChangeReq={prPanelData?.atLeastOneReviewerRule}
              changeReqReviewer={changeReqReviewer}
              codeOwnerChangeReqEntries={codeOwnerChangeReqEntries}
              reqCodeOwnerApproval={prPanelData?.reqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={prPanelData?.reqCodeOwnerLatestApproval}
              codeOwnerPendingEntries={codeOwnerPendingEntries}
              codeOwnerApprovalEntries={codeOwnerApprovalEntries}
              latestCodeOwnerApprovalArr={latestCodeOwnerApprovalArr}
              minApproval={prPanelData?.minApproval}
              minReqLatestApproval={prPanelData?.minReqLatestApproval}
              actions={mockPullRequestActions}
              resolvedCommentArr={prPanelData?.resolvedCommentArr}
              requiresCommentApproval={prPanelData?.requiresCommentApproval}
              ruleViolationArr={prPanelData?.ruleViolationArr}
              checkboxBypass={checkboxBypass}
              setCheckboxBypass={setCheckboxBypass}
            />
            <Spacer size={9} />
            <PullRequestFilters
              activityFilters={activityFilters}
              dateFilters={dateFilters}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              setActivityFilter={setActivityFilter}
              setDateOrderSort={setDateOrderSort}
            />
            <Spacer size={6} />

            <PullRequestOverview
              repoId={repoRef}
              refetchActivities={refetchActivities}
              commentStatusPullReq={commentStatusPullReq}
              data={activities?.map((item: TypesPullReqActivity) => {
                return {
                  author: item?.author,
                  created: item?.created,
                  deleted: item?.deleted,
                  edited: item?.edited,
                  id: item?.id,
                  kind: item?.kind,
                  mentions: item?.mentions,
                  metadata: item?.metadata,
                  order: item?.order,
                  parent_id: item?.parent_id,
                  payload: item as TypesPullReqActivity,
                  pullreq_id: item?.pullreq_id,
                  repo_id: item?.repo_id,
                  resolved: item?.resolved,
                  resolver: item?.resolver,
                  sub_order: item?.sub_order,
                  text: item?.text,
                  type: item?.type,
                  updated: item?.updated
                }
              })}
              pullReqMetadata={pullReqMetadata ? pullReqMetadata : undefined}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              handleSaveComment={handleSaveComment}
              currentUser={{ display_name: currentUserData?.display_name, uid: currentUserData?.uid }}
            />
            <Spacer size={9} />
            <PullRequestCommentBox currentUser={currentUserData?.display_name} onSaveComment={handleSaveComment} />
            <Spacer size={9} />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pl-0 pr-0">
            <PullRequestSideBar
              addReviewers={handleAddReviewer}
              usersList={principals?.map(user => ({ id: user.id, display_name: user.display_name, uid: user.uid }))}
              // repoMetadata={undefined}
              currentUserId={currentUserData?.uid}
              pullRequestMetadata={{ source_sha: pullReqMetadata?.source_sha as string }}
              processReviewDecision={processReviewDecision}
              refetchReviewers={refetchReviewers}
              handleDelete={handleDeleteReviewer}
              reviewers={reviewers?.map((val: TypesPullReqReviewer) => ({
                reviewer: { display_name: val.reviewer?.display_name, id: val.reviewer?.id },
                review_decision: val.review_decision,
                sha: val.sha
              }))}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </>
  )
}
