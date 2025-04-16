import { EnumPullReqReviewDecision, PullReqReviewDecision } from '../../pull-request.types'
import { ReviewerItem } from './pull-request-reviewers-item'

interface ReviewersListProps {
  reviewers: {
    reviewer?: { display_name?: string; id?: number }
    review_decision?: EnumPullReqReviewDecision
    sha?: string
  }[]
  pullRequestMetadata?: { source_sha: string }
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  handleDelete: (id: number) => void
  addReviewerError?: string
  removeReviewerError?: string
}

const ReviewersList: React.FC<ReviewersListProps> = ({
  reviewers,
  pullRequestMetadata,
  processReviewDecision,
  addReviewerError,
  removeReviewerError
}) => (
  <div className="flex flex-col gap-3">
    {addReviewerError || removeReviewerError ? (
      <span className="text-1 text-cn-foreground-danger">{addReviewerError ?? removeReviewerError}</span>
    ) : (
      <></>
    )}
    {reviewers.length ? (
      reviewers.map(({ reviewer, review_decision, sha }) => (
        <ReviewerItem
          key={reviewer?.id}
          reviewer={reviewer}
          reviewDecision={review_decision}
          sha={sha}
          sourceSHA={pullRequestMetadata?.source_sha}
          processReviewDecision={processReviewDecision}
        />
      ))
    ) : (
      <span className="text-2 font-medium text-cn-foreground-3">No reviewers</span>
    )}
  </div>
)

export { ReviewersList }
