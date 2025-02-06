import { Avatar, AvatarFallback, Icon } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'
import { getInitials } from '@utils/stringUtils'

const ReviewerItem = ({ reviewer, reviewDecision, sha, sourceSHA, processReviewDecision }: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <Icon name="comments" className="text-warning" />
      case PullReqReviewDecision.approved:
        return <Icon name="success" className="text-foreground-success" />
      case PullReqReviewDecision.changeReq:
        return <Icon name="triangle-warning" className="text-destructive" />
      case PullReqReviewDecision.pending:
        return <Icon name="pending-clock" className="text-icons-alert" />
      default:
        return null
    }
  }
  return (
    <div key={reviewer?.id} className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2">
        <Avatar className="size-6 rounded-full p-0">
          <AvatarFallback>
            <span className="text-12 text-foreground-1">{getInitials(reviewer?.display_name || '')}</span>
          </AvatarFallback>
        </Avatar>
        <div className="truncate text-14 font-medium text-foreground-8">{reviewer?.display_name}</div>
      </div>
      <div className="px-1.5">
        {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
      </div>
    </div>
  )
}

export { ReviewerItem }
