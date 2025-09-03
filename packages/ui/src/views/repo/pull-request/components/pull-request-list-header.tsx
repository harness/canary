import { FC } from 'react'

import { Button, IconV2, Layout, Text } from '@/components'
import { cn } from '@/utils'
import { EnumPullReqState, PRState } from '@/views'

interface PullRequestListHeaderProps {
  headerFilter: Array<PRState>
  closedPRs?: number
  mergedPRs?: number
  openPRs?: number
  onClick: (value: EnumPullReqState) => void
}

export const PullRequestListHeader: FC<PullRequestListHeaderProps> = ({
  headerFilter,
  closedPRs,
  mergedPRs,
  openPRs,
  onClick
}) => {
  return (
    <Layout.Horizontal gap="lg">
      {/*
        TODO: Design system: Currently we dont have exact button replacement for this.
        sm ghost variant button is adding more space between buttons because of the px padding.
        Have to check with design team.
       */}
      <Button onClick={() => onClick('open')} size={'xs'} variant={'transparent'}>
        <IconV2
          className={cn({
            'text-cn-success': headerFilter.includes('open'),
            'text-cn-3': !headerFilter.includes('open')
          })}
          name="git-pull-request"
        />
        <Text
          color={headerFilter.includes('open') ? 'foreground-1' : 'foreground-3'}
          variant={headerFilter.includes('open') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {openPRs} Open
        </Text>
      </Button>
      <Button onClick={() => onClick('merged')} size={'xs'} variant="transparent">
        <IconV2
          className={cn({
            'text-cn-merged': headerFilter.includes('merged'),
            'text-cn-3': !headerFilter.includes('merged')
          })}
          name="git-merge"
        />
        <Text
          color={headerFilter.includes('merged') ? 'foreground-1' : 'foreground-3'}
          variant={headerFilter.includes('merged') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {mergedPRs} Merged
        </Text>
      </Button>
      <Button onClick={() => onClick('closed')} size={'xs'} variant="transparent">
        <IconV2
          className={cn({
            'text-cn-danger': headerFilter.includes('closed'),
            'text-cn-3': !headerFilter.includes('closed')
          })}
          name="check"
        />
        <Text
          color={headerFilter.includes('closed') ? 'foreground-1' : 'foreground-3'}
          variant={headerFilter.includes('closed') ? 'body-single-line-strong' : 'body-single-line-normal'}
        >
          {closedPRs} Closed
        </Text>
      </Button>
    </Layout.Horizontal>
  )
}
