import { FC } from 'react'

import { Button, Icon } from '@/components'
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
    <div className="flex items-center gap-2">
      <Button onClick={onOpenClick} variant="ghost" theme="muted">
        <Icon
          className={cn({
            'text-cn-foreground-success': headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN
          })}
          size={14}
          name="pr-open"
        />
        <p
          className={cn(
            'text-2 leading-tight',
            headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN
              ? 'text-cn-foreground-2 font-medium'
              : 'text-cn-foreground-2'
          )}
        >
          {openPRs} Open
        </p>
      </Button>
      <Button onClick={onCloseClick} variant="ghost" theme="muted">
        <Icon
          className={cn({
            'text-cn-foreground-success': headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED
          })}
          size={14}
          name="tick"
        />
        <p
          className={cn(
            'text-2 leading-tight',
            headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED
              ? 'text-cn-foreground-2 font-medium'
              : 'text-cn-foreground-2'
          )}
        >
          {closedPRs} Closed
        </p>
      </Button>
    </div>
  )
}
