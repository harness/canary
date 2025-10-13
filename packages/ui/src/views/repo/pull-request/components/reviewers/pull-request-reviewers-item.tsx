import { Avatar, Button, IconV2, Layout } from '@/components'
import { EnumBypassListType, PullReqReviewDecision, ReviewerItemProps } from '@/views'
import { getIcon } from '@views/repo/utils'

import { ReviewerInfo } from './reviewer-info'

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

const ReviewerItem = ({
  reviewer,
  reviewDecision,
  sha,
  sourceSHA,
  processReviewDecision,
  handleDelete
}: ReviewerItemProps) => {
  const { id, type, display_name, email } = reviewer || {}
  const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)

  return (
    <Layout.Horizontal key={id} align="center" justify="between" gap="sm" className="group">
      <Layout.Horizontal align="center" gap="xs">
        {type === EnumBypassListType.USER ? (
          <Avatar name={display_name || ''} rounded />
        ) : (
          <IconV2 name={getIcon(type as EnumBypassListType)} size={'lg'} fallback="stop" className={'ml-cn-4xs'} />
        )}
        <ReviewerInfo display_name={display_name || ''} email={email || ''} />
      </Layout.Horizontal>

      <div className="relative">
        <Button
          className="absolute -inset-px z-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
          onClick={() => (id ? handleDelete(id) : null)}
          size="2xs"
          variant="transparent"
          iconOnly
          tooltipProps={{ content: 'Remove reviewer', align: 'end' }}
        >
          <IconV2 name="xmark" skipSize />
        </Button>
        <div className="relative z-[1] group-focus-within:-z-[1] group-focus-within:opacity-0 group-hover:-z-[1] group-hover:opacity-0">
          {updatedReviewDecision && getReviewDecisionIcon(updatedReviewDecision as PullReqReviewDecision)}
        </div>
      </div>
    </Layout.Horizontal>
  )
}

export { ReviewerItem }
