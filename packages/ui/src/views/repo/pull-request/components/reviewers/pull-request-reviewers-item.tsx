import { Avatar, Icon } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'

const ReviewerItem = ({ reviewer, reviewDecision, sha, sourceSHA, processReviewDecision }: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <Icon name="comments" className="text-cn-foreground-warning" />
      case PullReqReviewDecision.approved:
        return <Icon name="success" className="text-cn-foreground-success" />
      case PullReqReviewDecision.changeReq:
        return <Icon name="triangle-warning" className="text-cn-foreground-danger" />
      case PullReqReviewDecision.pending:
        return <Icon name="pending-clock" className="text-icons-alert" />
      default:
        return null
    }
  }
  return (
    <div key={reviewer?.id} className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2 overflow-hidden">
        <Avatar name={reviewer?.display_name} rounded />
        <div className="text-2 text-cn-foreground-1 truncate font-medium">{reviewer?.display_name}</div>
      </div>
      <div className="px-1.5">
        {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
      </div>
    </div>
  )
}

export { ReviewerItem }
