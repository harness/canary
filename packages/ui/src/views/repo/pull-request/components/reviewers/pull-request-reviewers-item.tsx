import { Avatar, Icon } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'
import { getInitials } from '@utils/stringUtils'

const ReviewerItem = ({ reviewer, reviewDecision, sha, sourceSHA, processReviewDecision }: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <Icon name="comments" className="text-warning" />
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
      <div className="flex items-center space-x-2">
        <Avatar.Root>
          <Avatar.Fallback>{getInitials(reviewer?.display_name || '')}</Avatar.Fallback>
        </Avatar.Root>
        <div className="truncate text-14 font-medium text-cn-foreground-1">{reviewer?.display_name}</div>
      </div>
      <div className="px-1.5">
        {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
      </div>
    </div>
  )
}

export { ReviewerItem }
