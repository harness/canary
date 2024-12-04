import { Text } from '@harnessio/canary'

import { EnumPullReqReviewDecision } from './interfaces'
import ReviewerItem from './pull-request-reviewers-item'

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
  ) => EnumPullReqReviewDecision
  handleDelete: (id: number) => void
}

const ReviewersList: React.FC<ReviewersListProps> = ({
  reviewers,
  pullRequestMetadata,
  processReviewDecision,
  handleDelete
}) => (
  <div className="flex flex-col gap-3">
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
      <Text size={2} weight="medium" color="foreground">
        No reviewers
      </Text>
    )}
  </div>
)

export default ReviewersList
