import { Avatar, Icon, Text } from '@/components'
import { getInitials } from '@utils/stringUtils'

import { PayloadAuthor, TypesPullReqActivity } from '../../pull-request-details-types'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestSystemReviewerDeleteItemProps {
  payload?: TypesPullReqActivity | undefined
  isLast: boolean
}
const PullRequestSystemReviewerDeleteItem: React.FC<PullRequestSystemReviewerDeleteItemProps> = ({
  payload,
  isLast
}) => {
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
              {payload?.author?.id === mentionId
                ? 'removed their request for review'
                : `removed the request for review from ${mentionDisplayName}`}
            </Text>
          )
        }
      ]}
      icon={<Icon name="edit-pen" size={14} className="p-0.5" />}
      isLast={isLast}
    />
  )
}

export default PullRequestSystemReviewerDeleteItem
