import { FC } from 'react'

import { IconV2, Text } from '@/components'
import { cn } from '@utils/cn'

import { PRState } from '../pull-request.types'

interface PullRequestListHeaderProps {
  onOpenClick: () => void
  onCloseClick: () => void
  headerFilter: Array<PRState>
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
            'text-cn-foreground-success': headerFilter.includes('open'),
            'text-cn-foreground-4': !headerFilter.includes('open')
          })}
          size="xs"
          name="git-pull-request"
        />
        <Text
          color={headerFilter.includes('open') ? 'foreground-1' : 'foreground-4'}
          variant={headerFilter.includes('open') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {openPRs} Open
        </Text>
      </button>
      <button onClick={onCloseClick} className="flex items-center gap-1.5">
        <IconV2
          className={cn({
            'text-cn-foreground-success': headerFilter.includes('closed'),
            'text-cn-foreground-4': !headerFilter.includes('closed')
          })}
          size="xs"
          name="check"
        />
        <Text
          color={headerFilter.includes('closed') ? 'foreground-1' : 'foreground-4'}
          variant={headerFilter.includes('closed') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {closedPRs} Closed
        </Text>
      </button>
    </div>
  )
}
