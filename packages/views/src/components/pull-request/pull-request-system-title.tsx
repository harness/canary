import { Avatar, AvatarFallback, Icon, Text } from '@harnessio/canary'

import { getInitials } from '../../utils/utils'
import { GeneralPayload, PayloadAuthor, TypesPullReqActivity } from './interfaces'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestSystemTitleItemProps {
  payload?: TypesPullReqActivity | undefined
  isLast: boolean
}
const PullRequestSystemTitleItem: React.FC<PullRequestSystemTitleItemProps> = ({ payload, isLast }) => {
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
              changed title from
              <span className="line-through">{(payload?.payload?.payload as GeneralPayload)?.old as string}</span> to
              {(payload?.payload?.payload as GeneralPayload)?.new as string}
            </Text>
          )
        }
      ]}
      icon={<Icon name="edit-pen" size={14} className="p-0.5" />}
      isLast={isLast}
    />
  )
}

export default PullRequestSystemTitleItem
