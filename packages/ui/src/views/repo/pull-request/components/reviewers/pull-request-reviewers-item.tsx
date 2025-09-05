import { Avatar, IconV2 } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'

import { ReviewerInfo } from './reviewer-info'

const ReviewerItem = ({ reviewer, reviewDecision, sha, sourceSHA, processReviewDecision }: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <IconV2 size="lg" name="refresh-circle-solid" className="text-cn-disabled" />
      case PullReqReviewDecision.approved:
        return <IconV2 size="lg" name="check-circle-solid" className="text-cn-icon-success" />
      case PullReqReviewDecision.changeReq:
        return <IconV2 size="lg" name="warning-triangle-solid" className="text-cn-danger" />
      case PullReqReviewDecision.pending:
        return <IconV2 size="lg" name="clock-solid" className="text-cn-warning" />
      default:
        return null
    }
  }
  return (
    <div key={reviewer?.id} className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2 overflow-hidden">
        <Avatar name={reviewer?.display_name} rounded />
        <ReviewerInfo display_name={reviewer?.display_name || ''} email={reviewer?.email || ''} />
      </div>
      <div className="px-1.5">
        {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
      </div>
    </div>
  )
}

export { ReviewerItem }
