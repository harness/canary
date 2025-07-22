import { Avatar, IconV2, Text } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'

const ReviewerItem = ({ reviewer, reviewDecision, sha, sourceSHA, processReviewDecision }: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <IconV2 name="message" className="text-cn-foreground-warning" />
      case PullReqReviewDecision.approved:
        return <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />
      case PullReqReviewDecision.changeReq:
        return <IconV2 name="warning-triangle-solid" className="text-cn-foreground-danger" />
      case PullReqReviewDecision.pending:
        return <IconV2 name="clock-solid" className="text-cn-foreground-warning" />
      default:
        return null
    }
  }
  return (
    <div key={reviewer?.id} className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2 overflow-hidden">
        <Avatar name={reviewer?.display_name} rounded />
        <Text className="truncate text-2 font-medium text-cn-foreground-1" title={reviewer?.display_name}>
          {reviewer?.display_name}
        </Text>
      </div>
      <div className="px-1.5">
        {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
      </div>
    </div>
  )
}

export { ReviewerItem }
