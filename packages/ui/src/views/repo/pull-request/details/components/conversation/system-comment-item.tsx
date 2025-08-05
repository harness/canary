import { FC, ReactNode } from 'react'

import { Avatar } from '@/components'
import { PrincipalPropsType, TypesPullReqActivity } from '@/views'

import { CommentHeader } from './comment-header'
import { TimelineItem } from './timeline-item'

export interface SystemCommentItemProps {
  payload: TypesPullReqActivity
  icon?: ReactNode
  content?: ReactNode
  isLast?: boolean
  principalProps: PrincipalPropsType
  header?: {
    description?: ReactNode
    selectStatus?: ReactNode
  }
  className?: string
}

export const SystemCommentItem: FC<SystemCommentItemProps> = ({
  payload,
  icon,
  content,
  isLast = false,
  principalProps,
  header = {},
  className,
  ...restProps
}) => {
  return (
    <TimelineItem icon={icon} isLast={isLast} id={`comment-${payload.id}`} className={className}>
      <div className="flex w-full items-center justify-between gap-x-2">
        <CommentHeader
          avatar={<Avatar name={payload?.author?.display_name} rounded />}
          name={payload?.author?.display_name}
          description={header.description}
          selectStatus={header.selectStatus}
          showActions={false}
        />
      </div>
      {content}
    </TimelineItem>
  )
}

SystemCommentItem.displayName = 'SystemCommentItem'
