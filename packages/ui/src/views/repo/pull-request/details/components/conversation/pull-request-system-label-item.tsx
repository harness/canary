import { Avatar, AvatarFallback, Badge, Icon, Text } from '@components/index'
import { getInitials } from '@utils/stringUtils'

import { GeneralPayload, LabelActivity, PayloadAuthor, TypesPullReqActivity } from '../../pull-request-details-types'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestSystemLabelItemProps {
  payload?: TypesPullReqActivity | undefined
  isLast: boolean
}
const PullRequestSystemLabelItem: React.FC<PullRequestSystemLabelItemProps> = ({ payload, isLast }) => {
  const data = payload?.payload?.payload as GeneralPayload
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
                  {getInitials(payload?.author?.display_name || '')}
                </Text>
              </AvatarFallback>
            </Avatar>
          ),
          name: (payload?.payload?.author as PayloadAuthor)?.display_name,
          description: (
            <Text color="tertiaryBackground">
              {((payload?.payload?.payload as GeneralPayload)?.type as LabelActivity) === 'assign' ? (
                <>applied</>
              ) : (
                <>
                  {((payload?.payload?.payload as GeneralPayload)?.type as LabelActivity) === 'reassign'
                    ? 'reassigned'
                    : 'removed'}
                </>
              )}{' '}
              label{'  '}
              <Badge
                variant="outline"
                size="sm"
                borderRadius="full"
                className="ml-2 outline outline-1"
                style={{ outlineColor: data?.label_color as string, color: data?.label_color as string }}
              >
                <p className="max-w-[376px] truncate">{data?.label as string}</p>
              </Badge>
            </Text>
          )
        }
      ]}
      icon={<Icon name="edit-pen" size={14} className="p-0.5" />}
      isLast={isLast}
    />
  )
}

export default PullRequestSystemLabelItem
