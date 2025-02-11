import { Avatar, Icon, Text } from '@/components'
import { LabelMarker } from '@components/label-marker'
import { getInitials } from '@utils/stringUtils'
import { ColorsEnum } from '@views/labels'

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
            <Avatar.Root>
              <Avatar.Fallback>
                {/* TODO: fix fallback string */}
                {getInitials(payload?.author?.display_name || '')}
              </Avatar.Fallback>
            </Avatar.Root>
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
              <LabelMarker
                key={data?.label as string}
                color={data?.label_color as ColorsEnum}
                label={data?.label as string}
                value={data?.value as string}
              />
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
