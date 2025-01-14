import { Text } from '@components/index'

import { EnumPullReqReviewDecision, PullReqReviewDecision } from '../pull-request.types'
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
  handleDelete,
  addReviewerError,
  removeReviewerError
}) => (
  <div className="flex flex-col gap-3">
    {addReviewerError || removeReviewerError ? (
      <Text size={1} className="text-destructive">
        {addReviewerError ?? removeReviewerError}
      </Text>
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
          handleDelete={handleDelete}
        />
      ))
    ) : (
      <Text size={2} weight="medium" color="foreground-5">
        No reviewers
      </Text>
    )}
  </div>
)

export { ReviewersList }
