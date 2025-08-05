import { FC, ReactNode } from 'react'

import { NodeGroup } from '@/components'
import { cn } from '@utils/cn'

export interface TimelineItemProps {
  icon?: ReactNode
  isLast?: boolean
  hideIconBorder?: boolean
  children: ReactNode
  className?: string
  iconClassName?: string
  id?: string
}

export const TimelineItem: FC<TimelineItemProps> = ({
  icon,
  isLast = false,
  hideIconBorder = false,
  children,
  className,
  iconClassName,
  id
}) => {
  return (
    <div id={id}>
      <NodeGroup.Root
        className={cn(
          {
            'pb-8': !isLast,
            'pb-4': isLast
          },
          className
        )}
      >
        {icon && (
          <NodeGroup.Icon className={cn({ 'border-transparent': hideIconBorder }, iconClassName)}>
            {icon}
          </NodeGroup.Icon>
        )}
        {children}
        {!isLast && <NodeGroup.Connector className="left-[0.8rem]" />}
      </NodeGroup.Root>
    </div>
  )
}

TimelineItem.displayName = 'TimelineItem'
