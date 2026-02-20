import { Alert } from '@harnessio/ui/components'
import { Layout } from '@harnessio/ui/components'
import { Text } from '@harnessio/ui/components'
import { isEmpty } from 'lodash-es'

import { EnumPullReqReviewDecision, PRReviewer, PullReqReviewDecision } from '../../pull-request.types'
import { ReviewerItem } from './pull-request-reviewers-item'

interface ReviewersListProps {
  reviewers: PRReviewer[]
  userGroupReviewers: PRReviewer[]
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
  userGroupReviewers,
  pullRequestMetadata,
  processReviewDecision,
  addReviewerError,
  removeReviewerError,
  handleDelete
}) => (
  <Layout.Vertical gapY="md" className="pr-cn-3xs">
    {(addReviewerError || removeReviewerError) && (
      <Alert.Root theme="danger">
        <Alert.Title>Failed to add reviewer</Alert.Title>
        <Alert.Description>{addReviewerError ?? removeReviewerError}</Alert.Description>
      </Alert.Root>
    )}

    {!isEmpty(reviewers) || !isEmpty(userGroupReviewers) ? (
      [...userGroupReviewers, ...reviewers].map(({ reviewer, review_decision, sha }) => (
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
      <Text variant="body-single-line-strong" color="foreground-3">
        No reviewers
      </Text>
    )}
  </Layout.Vertical>
)

export { ReviewersList }
