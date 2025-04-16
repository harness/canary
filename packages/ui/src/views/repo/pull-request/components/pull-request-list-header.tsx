import { FC } from 'react'

import { Icon } from '@/components'
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
      <button onClick={onOpenClick} className="flex items-center gap-1.5">
        <Icon
          className={cn(
            headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN ? 'text-icons-success' : 'text-icons-1'
          )}
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
      </button>
      <button onClick={onCloseClick} className="flex items-center gap-1.5">
        <Icon
          className={cn(
            headerFilter === PULL_REQUEST_LIST_HEADER_FILTER_STATES.CLOSED ? 'text-icons-success' : 'text-icons-1'
          )}
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
      </button>
    </div>
  )
}
