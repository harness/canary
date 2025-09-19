import { FC, useEffect, useRef, useState } from 'react'

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

enum EnumTabState {
  Open = 'open',
  Closed = 'closed',
  Merged = 'merged'
}

export const PullRequestListHeader: FC<PullRequestListHeaderProps> = ({
  headerFilter,
  closedPRs,
  mergedPRs,
  openPRs,
  onClick,
  isLoading
}) => {
  const [loadingSource, setLoadingSource] = useState<EnumTabState | null>(null)

  const tabRefs: Record<EnumTabState, React.RefObject<HTMLButtonElement>> = {
    [EnumTabState.Open]: useRef<HTMLButtonElement>(null),
    [EnumTabState.Closed]: useRef<HTMLButtonElement>(null),
    [EnumTabState.Merged]: useRef<HTMLButtonElement>(null)
  }

  const handleChange = (value: string) => {
    setLoadingSource(value as EnumTabState)
    onClick(value as EnumPullReqState)
  }

  useEffect(() => {
    if (!isLoading && loadingSource) {
      tabRefs[loadingSource].current?.focus()
      setLoadingSource(null)
    }
  }, [isLoading, loadingSource])

  return (
    <Tabs.Root value={headerFilter[0]} onValueChange={handleChange}>
      <Tabs.List variant="ghost">
        <Tabs.Trigger
          ref={tabRefs[EnumTabState.Open]}
          value={EnumTabState.Open}
          icon="git-pull-request"
          disabled={isLoading}
        >
          {openPRs} Open
        </Tabs.Trigger>
        <Tabs.Trigger
          ref={tabRefs[EnumTabState.Closed]}
          value={EnumTabState.Closed}
          icon="git-pull-request-closed"
          disabled={isLoading}
        >
          {closedPRs} Closed
        </Tabs.Trigger>
        <Tabs.Trigger
          ref={tabRefs[EnumTabState.Merged]}
          value={EnumTabState.Merged}
          icon="git-merge"
          disabled={isLoading}
        >
          {mergedPRs} Merged
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
