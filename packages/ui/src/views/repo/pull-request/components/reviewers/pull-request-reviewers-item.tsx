import { Avatar, IconV2, Layout } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'

import { ReviewerInfo } from './reviewer-info'

const ReviewerItem = ({ reviewer, reviewDecision, sha, sourceSHA, processReviewDecision }: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <IconV2 size="lg" name="refresh-circle-solid" color="neutral" />
      case PullReqReviewDecision.approved:
        return <IconV2 size="lg" name="check-circle-solid" color="success" />
      case PullReqReviewDecision.changeReq:
        return <IconV2 size="lg" name="warning-triangle-solid" color="danger" />
      case PullReqReviewDecision.pending:
        return <IconV2 size="lg" name="clock-solid" color="warning" />
      default:
        return null
    }
  }
  return (
    <Layout.Horizontal key={reviewer?.id} align="center" justify="between" gap="sm">
      <Layout.Horizontal align="center" gap="xs">
        <Avatar name={reviewer?.display_name} rounded size="md" />
        <ReviewerInfo display_name={reviewer?.display_name || ''} email={reviewer?.email || ''} />
      </Layout.Horizontal>

      {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
    </Layout.Horizontal>
  )
}

export { ReviewerItem }
