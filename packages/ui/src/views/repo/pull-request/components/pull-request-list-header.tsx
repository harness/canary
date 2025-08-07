import { FC } from 'react'

import { Button, IconV2, Text } from '@/components'
import { cn } from '@utils/cn'

import { PRState } from '../pull-request.types'

interface PullRequestListHeaderProps {
  onOpenClick: () => void
  onMergedClick: () => void
  onCloseClick: () => void
  headerFilter: Array<PRState>
  closedPRs?: number
  mergedPRs?: number
  openPRs?: number
}

export const PullRequestListHeader: FC<PullRequestListHeaderProps> = ({
  onCloseClick,
  onOpenClick,
  onMergedClick,
  headerFilter,
  closedPRs,
  mergedPRs,
  openPRs
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* 
        TODO: Design system: Currently we dont have exact button replacement for this.
        sm ghost variant button is adding more space between buttons because of the px padding.
        Have to check with design team.
       */}
      <Button onClick={onOpenClick} size={'xs'} variant={'transparent'}>
        <IconV2
          className={cn({
            'text-cn-foreground-success': headerFilter.includes('open'),
            'text-cn-foreground-4': !headerFilter.includes('open')
          })}
          name="git-pull-request"
        />
        <Text
          color={headerFilter.includes('open') ? 'foreground-1' : 'foreground-4'}
          variant={headerFilter.includes('open') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {openPRs} Open
        </Text>
      </Button>
      <Button onClick={onMergedClick} size={'xs'} variant="transparent">
        <IconV2
          className={cn({
            'text-cn-foreground-success': headerFilter.includes('merged'),
            'text-cn-foreground-4': !headerFilter.includes('merged')
          })}
          name="git-merge"
        />
        <Text
          color={headerFilter.includes('merged') ? 'foreground-1' : 'foreground-4'}
          variant={headerFilter.includes('merged') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {mergedPRs} Merged
        </Text>
      </Button>
      <Button onClick={onCloseClick} size={'xs'} variant="transparent">
        <IconV2
          className={cn({
            'text-cn-foreground-success': headerFilter.includes('closed'),
            'text-cn-foreground-4': !headerFilter.includes('closed')
          })}
          name="check"
        />
        <Text
          color={headerFilter.includes('closed') ? 'foreground-1' : 'foreground-4'}
          variant={headerFilter.includes('closed') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {closedPRs} Closed
        </Text>
      </Button>
    </div>
  )
}
