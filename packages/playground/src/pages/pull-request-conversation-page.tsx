import { useMemo, useState } from 'react'

import { noop } from 'lodash-es'

import { Spacer } from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { NoData } from '../components/no-data'
import { TypesPullReqActivity } from '../components/pull-request/interfaces'
import { PullRequestCommentBox } from '../components/pull-request/pull-request-comment-box'
import { PullRequestFilters } from '../components/pull-request/pull-request-filters'
import { PullRequestOverview } from '../components/pull-request/pull-request-overview'
import { PullRequestPanel } from '../components/pull-request/pull-request-panel'
import { PullRequestSideBar } from '../components/pull-request/pull-request-side-bar'
import { processReviewDecision, useActivityFilters, useDateFilters } from '../components/pull-request/utils'
import { mockChangeReqData } from '../data/mockChangeReqData'
import { mockChangesData } from '../data/mockChangesData'
import { mockChecksFailedInfo, mockChecksSucceededInfo } from '../data/mockCheckInfo'
import { mockChecksFailedData, mockChecksSuccessData } from '../data/mockChecksData'
import { mockCodeOwnerData } from '../data/mockCodeOwner'
import { mockCommentResolvedInfo, mockCommentUnresolvedInfo } from '../data/mockCommentInfo'
import { mockOverviewRealData } from '../data/mockOverviewRealData'
import {
  mockPullReqMetadata,
  mockPullReqMetadataConflict,
  mockPullReqMetadataUnchecked
} from '../data/mockPullReqMetadata'
import { mockPullRequestActions } from '../data/mockPullRequestActions'
// import { mockOverviewData } from '../data/mockOverviewData'
import { mockReviewers } from '../data/mockReviewer'
import { FullWidth2ColumnLayout } from '../layouts/FullWidth2ColumnLayout'
import PlaygroundPullRequestConversationSettings from '../settings/pull-request-conversation-settings'

// Mock useMutate hook
// Define the type for the useFakeMutate parameters
interface UseFakeMutateParams {
  verb: string
  path: string
}

// Define the type for the response data
interface ResponseData {
  id: number
  text: string
  parent_id?: number
  [key: string]: unknown // Add other fields as necessary
}
interface CommentData {
  text: string
  parent_id?: number
}
// Mock useMutate hook
const useFakeMutate = ({ verb, path }: UseFakeMutateParams) => {
  console.log(verb, path)
  const mutate = (data: CommentData) => {
    return new Promise<{ data: ResponseData }>(resolve => {
      setTimeout(() => {
        // Simulate a successful API response
        resolve({ data: { ...data, id: Date.now() } })
      }, 1000)
    })
  }
  return { mutate }
}
export default function PullRequestConversationPage() {
  const [loadState, setLoadState] = useState('data-loaded')
  const dateFilters = useDateFilters()
  const [dateOrderSort, setDateOrderSort] = useState<{ label: string; value: string }>(dateFilters[0])
  const activityFilters = useActivityFilters()
  const [activityFilter, setActivityFilter] = useState<{ label: string; value: string }>(activityFilters[0])
  const ruleViolation = loadState !== 'data-loaded-checksFailed' ? false : true
  const checksInfo = loadState === 'data-loaded-checksFailed' ? mockChecksFailedInfo : mockChecksSucceededInfo
  const commentsInfo = loadState === 'data-loaded-checksFailed' ? mockCommentUnresolvedInfo : mockCommentResolvedInfo
  const checksData = loadState === 'data-loaded-checksFailed' ? mockChecksFailedData : mockChecksSuccessData
  const [checkboxBypass, setCheckboxBypass] = useState(true)
  const pullReqMetadata =
    loadState === 'data-loaded-unchecked'
      ? mockPullReqMetadataUnchecked
      : loadState === 'data-loaded-conflict'
        ? mockPullReqMetadataConflict
        : mockPullReqMetadata
  // will add appropiate mock data here in upcoming prs
  const mockMinApproval = 2
  const mockMinReqLatestApproval = undefined
  const mockApprovedEvaluations: never[] = [] // will put data here just in next pr
  const mockChangeReqEvaluations = mockChangeReqData
  const mockCodeOwners = mockCodeOwnerData
  const mockLatestApprovalArr: never[] = [] // will put data here just in next pr
  const mockReqNoChangeReq = false
  const mockChangeReqReviewer = 'Admin'
  const mockCodeOwnerChangeReqEntries = undefined
  const mockReqCodeOwnerApproval = true
  const mockReqCodeOwnerLatestApproval = false
  const mockCodeOwnerPendingEntries = undefined
  const mockCodeOwnerApprovalEntries = undefined
  const mockLatestCodeOwnerApprovalArr = undefined
  const mockConflictingFiles = loadState === 'data-loaded-conflict' ? ['test', 't'] : undefined
  const [mockActivties, setMockActivities] = useState<TypesPullReqActivity[]>(mockOverviewRealData)
  const currentUser = 'Calvin'
  // const path = useMemo(
  //   () => `/api/v1/repos/${repoMetadata.path}/+/pullreq/${pullReqMetadata.number}/comments`,
  //   [repoMetadata.path, pullReqMetadata.number]
  // )
  const path = useMemo(
    () => `/api/v1/repos/repo/+/pullreq/${pullReqMetadata.number}/comments`,
    [pullReqMetadata.number]
  )
  const { mutate: saveComment } = useFakeMutate({ verb: 'POST', path })
  let count = 5
  const handleSaveComment = (comment: string, parentId?: number) => {
    // Create a temporary comment object

    const newComment: TypesPullReqActivity = {
      id: count, // Temporary ID
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
    setMockActivities(prevData => [...prevData, newComment])

    // Persist the new comment to the API
    saveComment({ text: comment, parent_id: parentId })
      .then(() => {
        // TODO: set response after saving the comment to update the local state with the new comment data
        // Update the state with the response from the API
        // setMockActivities(prevData => prevData.map(item => (item.id === newComment.id ? response.data : item)))
      })
      .catch(error => {
        // Handle error (e.g., remove the temporary comment or show an error message)
        setMockActivities(prevData => prevData.filter(item => item.id !== newComment.id))
        console.error('Failed to save comment:', error)
      })
  }
  if (loadState == 'loading') {
    return (
      <>
        <SkeletonList />
        <PlaygroundPullRequestConversationSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          iconName="no-data-folder"
          title="No activity yet"
          description={['There is no activity for this pull request yet.']}
        />
        <PlaygroundPullRequestConversationSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }
  return (
    <>
      <FullWidth2ColumnLayout
        leftColumn={
          <>
            <PullRequestPanel
              spaceId={undefined}
              repoId={undefined}
              changesInfo={mockChangesData}
              checksInfo={checksInfo}
              commentsInfo={commentsInfo}
              ruleViolation={ruleViolation}
              checks={checksData}
              pullReqMetadata={pullReqMetadata}
              PRStateLoading={false}
              conflictingFiles={mockConflictingFiles}
              approvedEvaluations={mockApprovedEvaluations}
              changeReqEvaluations={mockChangeReqEvaluations}
              codeOwners={mockCodeOwners}
              latestApprovalArr={mockLatestApprovalArr}
              reqNoChangeReq={mockReqNoChangeReq}
              changeReqReviewer={mockChangeReqReviewer}
              codeOwnerChangeReqEntries={mockCodeOwnerChangeReqEntries}
              reqCodeOwnerApproval={mockReqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={mockReqCodeOwnerLatestApproval}
              codeOwnerPendingEntries={mockCodeOwnerPendingEntries}
              codeOwnerApprovalEntries={mockCodeOwnerApprovalEntries}
              latestCodeOwnerApprovalArr={mockLatestCodeOwnerApprovalArr}
              minApproval={mockMinApproval}
              minReqLatestApproval={mockMinReqLatestApproval}
              actions={mockPullRequestActions}
              ruleViolationArr={undefined}
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
              repoId={'repoId'}
              commentStatusPullReq={noop}
              refetchActivities={noop}
              data={mockActivties}
              pullReqMetadata={pullReqMetadata}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              handleSaveComment={handleSaveComment}
              currentUser={{ display_name: currentUser, uid: currentUser }}
            />
            <Spacer size={9} />
            <PullRequestCommentBox currentUser={currentUser} onSaveComment={handleSaveComment} />
            <Spacer size={9} />
          </>
        }
        rightColumn={
          <PullRequestSideBar
            handleDelete={noop}
            // repoMetadata={undefined}
            pullRequestMetadata={undefined}
            processReviewDecision={processReviewDecision}
            refetchReviewers={function (): void {
              throw new Error('Function not implemented.')
            }}
            reviewers={mockReviewers}
          />
        }
      />
      <PlaygroundPullRequestConversationSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
