import { Avatar, AvatarFallback, Icon, MoreActionsTooltip, Text } from '@/components'
import { PullReqReviewDecision, ReviewerItemProps } from '@/views'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'

const ReviewerItem = ({
  reviewer,
  reviewDecision,
  sha,
  sourceSHA,
  processReviewDecision,
  handleDelete
}: ReviewerItemProps) => {
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
  const getReviewDecisionIcon = (decision: PullReqReviewDecision) => {
    switch (decision) {
      case PullReqReviewDecision.outdated:
        return <Icon name="comments" className="text-warning" />
      case PullReqReviewDecision.approved:
        return <Icon name="success" className="text-success" />
      case PullReqReviewDecision.changeReq:
        return <Icon name="triangle-warning" className="text-destructive" />
      case PullReqReviewDecision.pending:
        return <Icon name="clock" />
      default:
        return null
    }
  }
  return (
    <div key={reviewer?.id} className="mr-1 flex items-center space-x-2">
      <Avatar
        className={cn('h-6 w-6 rounded-full', {
          'p-0': updatedReviewDecision !== PullReqReviewDecision.changeReq
        })}
      >
        <AvatarFallback>
          <Text size={1} color="tertiaryBackground">
            {getInitials(reviewer?.display_name || '')}
          </Text>
        </AvatarFallback>
      </Avatar>
      <div className="truncate">{reviewer?.display_name}</div>
      <div className="grow" />

      {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
      <MoreActionsTooltip
        actions={[
          {
            isDanger: true,
            title: 'Delete Reviewer',
            onClick: () => (reviewer?.id ? handleDelete(reviewer.id) : {})
          }
        ]}
      />
    </div>
  )
}

export { ReviewerItem }
