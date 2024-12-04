import { Avatar, AvatarFallback, Icon, Text } from '@harnessio/canary'

import { getInitials } from '../../utils/utils'
import { PayloadAuthor, TypesPullReqActivity } from './interfaces'
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
            <Avatar className="h-6 w-6 rounded-full p-0">
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
