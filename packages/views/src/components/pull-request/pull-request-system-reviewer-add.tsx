import { Avatar, AvatarFallback, Icon, Text } from '@harnessio/canary'

import { getInitials } from '../../utils/utils'
import { GeneralPayload, PayloadAuthor, TypesPullReqActivity } from './interfaces'
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
            <Avatar className="size-6 rounded-full p-0">
              <AvatarFallback>
                <Text size={1} color="tertiaryBackground">
                  {/* TODO: fix fallback string */}
                  {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                </Text>
              </AvatarFallback>
            </Avatar>
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
