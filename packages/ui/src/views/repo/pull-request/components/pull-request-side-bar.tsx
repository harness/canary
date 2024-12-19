import { ReviewersHeader } from '../details/components/conversation/pull-request-reviewers-header'
import { ReviewersList } from '../details/components/conversation/pull-request-reviewers-list'
import { EnumPullReqReviewDecision, PullReqReviewDecision } from '../details/pull-request-details-types'

interface PullRequestSideBarProps {
  reviewers?: {
    reviewer?: { display_name?: string; id?: number }
    review_decision?: EnumPullReqReviewDecision
    sha?: string
  }[]
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  pullRequestMetadata?: { source_sha: string }
  refetchReviewers: () => void
  handleDelete: (id: number) => void
  addReviewers?: (id?: number) => void
  usersList?: { display_name?: string; id?: number; uid?: string }[]
  currentUserId?: string
}

const PullRequestSideBar = (props: PullRequestSideBarProps) => {
  const {
    usersList,
    reviewers = [],
    pullRequestMetadata,
    processReviewDecision,
    handleDelete,
    addReviewers,
    currentUserId
  } = props

  return (
    <div>
      <div className="flex flex-col gap-3">
        <ReviewersHeader currentUserId={currentUserId} usersList={usersList} addReviewers={addReviewers} />
        <ReviewersList
          reviewers={reviewers}
          pullRequestMetadata={pullRequestMetadata}
          processReviewDecision={processReviewDecision}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export { PullRequestSideBar }
