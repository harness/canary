import { FC } from 'react'

import { Tabs } from '@/components'
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
    <Tabs.Root value={headerFilter[0]} onValueChange={value => onClick(value as EnumPullReqState)}>
      <Tabs.List variant="ghost">
        <Tabs.Trigger value="open" icon="git-pull-request">
          {openPRs} Open
        </Tabs.Trigger>
        <Tabs.Trigger value="closed" icon="git-pull-request-closed">
          {closedPRs} Closed
        </Tabs.Trigger>
        <Tabs.Trigger value="merged" icon="git-merge">
          {mergedPRs} Merged
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
