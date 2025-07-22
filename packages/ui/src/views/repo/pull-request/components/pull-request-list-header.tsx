import { FC } from 'react'

import { IconV2, Text } from '@/components'
import { cn } from '@utils/cn'

import { PULL_REQUEST_LIST_HEADER_FILTER_STATES } from '../pull-request.types'

interface PullRequestListHeaderProps {
  onOpenClick: () => void
  onCloseClick: () => void
  headerFilter: string
  closedPRs?: number
  openPRs?: number
}

export const PullRequestListHeader: FC<PullRequestListHeaderProps> = ({
  onCloseClick,
  onOpenClick,
  headerFilter,
  closedPRs,
  openPRs
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* 
        TODO: Design system: Currently we dont have exact button replacement for this.
        sm ghost variant button is adding more space between buttons because of the px padding.
        Have to check with design team.
       */}
      <button onClick={onOpenClick} className="flex items-center gap-1.5">
        <IconV2
          className={cn({
            'text-cn-foreground-success': headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN,
            'text-cn-foreground-4': headerFilter !== PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN
          })}
          size="xs"
          name="git-pull-request"
        />
        <Text
          color={headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN ? 'foreground-1' : 'foreground-4'}
          className={cn({ 'font-medium': headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN })}
        >
          {openPRs} Open
        </Text>
      </button>
      <button onClick={onCloseClick} className="flex items-center gap-1.5">
        <IconV2
          className={cn({
            'text-cn-foreground-success': headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED,
            'text-cn-foreground-4': headerFilter !== PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED
          })}
          size="xs"
          name="check"
        />
        <Text
          color={headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED ? 'foreground-1' : 'foreground-4'}
          className={cn({ 'font-medium': headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED })}
        >
          {closedPRs} Closed
        </Text>
      </button>
    </div>
  )
}
