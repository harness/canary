import { isEmpty } from 'lodash-es'

import { Alert, Layout, Text } from '@harnessio/ui/components'

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
  handleUserGroupReviewerDelete: (id: number) => void
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
  handleDelete,
  handleUserGroupReviewerDelete
}) => {
  const entries: Array<{ item: PRReviewer; onDelete: (id: number) => void }> = [
    ...userGroupReviewers.map(item => ({ item, onDelete: handleUserGroupReviewerDelete })),
    ...reviewers.map(item => ({ item, onDelete: handleDelete }))
  ]

  return (
    <Layout.Vertical gapY="md" className="pr-cn-3xs">
      {(addReviewerError || removeReviewerError) && (
        <Alert.Root theme="danger">
          <Alert.Title>Failed to add reviewer</Alert.Title>
          <Alert.Description>{addReviewerError ?? removeReviewerError}</Alert.Description>
        </Alert.Root>
      )}

      {!isEmpty(reviewers) || !isEmpty(userGroupReviewers) ? (
        entries.map(({ item: { reviewer, review_decision, sha, fetchGroupMembers }, onDelete }) => (
          <ReviewerItem
            key={reviewer?.id}
            reviewer={reviewer}
            reviewDecision={review_decision}
            sha={sha}
            sourceSHA={pullRequestMetadata?.source_sha}
            processReviewDecision={processReviewDecision}
            handleDelete={onDelete}
            fetchGroupMembers={fetchGroupMembers}
          />
        ))
      ) : (
        <Text variant="body-single-line-strong" color="foreground-3">
          No reviewers
        </Text>
      )}
    </Layout.Vertical>
  )
}

export { ReviewersList }
