import { FC } from 'react'

import { Tabs } from '@/components'
import { EnumPullReqState, PRState } from '@/views'

interface PullRequestListHeaderProps {
  headerFilter: Array<PRState>
  closedPRs?: number
  mergedPRs?: number
  openPRs?: number
  onClick: (value: EnumPullReqState) => void
  isLoading?: boolean
}

export const PullRequestListHeader: FC<PullRequestListHeaderProps> = ({
  headerFilter,
  closedPRs,
  mergedPRs,
  openPRs,
  onClick,
  isLoading
}) => {
  return (
    <Tabs.Root value={headerFilter[0]} onValueChange={value => onClick(value as EnumPullReqState)}>
      <Tabs.List variant="ghost">
        <Tabs.Trigger value="open" icon="git-pull-request" disabled={isLoading}>
          {openPRs} Open
        </Tabs.Trigger>
        <Tabs.Trigger value="closed" icon="git-pull-request-closed" disabled={isLoading}>
          {closedPRs} Closed
        </Tabs.Trigger>
        <Tabs.Trigger value="merged" icon="git-merge" disabled={isLoading}>
          {mergedPRs} Merged
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
