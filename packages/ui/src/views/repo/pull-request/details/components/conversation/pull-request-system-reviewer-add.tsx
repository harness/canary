import { Avatar, Icon, Text } from '@/components'
import { getInitials } from '@utils/stringUtils'

import { GeneralPayload, PayloadAuthor, TypesPullReqActivity } from '../../pull-request-details-types'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestSystemReviewerAddItemProps {
  payload?: TypesPullReqActivity | undefined
  isLast: boolean
}
const PullRequestSystemReviewerAddItem: React.FC<PullRequestSystemReviewerAddItemProps> = ({ payload, isLast }) => {
  const mentionId = payload?.metadata?.mentions?.ids?.[0] ?? 0
  const mentionDisplayName = payload?.mentions?.[mentionId]?.display_name ?? ''
  return (
    <PullRequestTimelineItem
      key={payload?.id} // Consider using a unique ID if available
      header={[
        {
          avatar: (
            <Avatar.Root>
              <Avatar.Fallback>
                {/* TODO: fix fallback string */}
                {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
              </Avatar.Fallback>
            </Avatar.Root>
          ),
          name: (payload?.payload?.author as PayloadAuthor)?.display_name,
          description: (
            <Text color="tertiaryBackground">
              {(payload?.payload?.payload as GeneralPayload)?.reviewer_type === 'self_assigned'
                ? 'self-requested a review'
                : (payload?.payload?.payload as GeneralPayload)?.reviewer_type === 'assigned'
                  ? `assigned ${mentionDisplayName} as a reviewer`
                  : `requested a review from ${mentionDisplayName}`}
            </Text>
          )
        }
      ]}
      icon={<Icon name="pr-review" size={14} className="p-0.5" />}
      isLast={isLast}
    />
  )
}

export default PullRequestSystemReviewerAddItem
