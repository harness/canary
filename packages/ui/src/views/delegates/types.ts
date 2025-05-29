export interface DelegateConnectivityListProps {
  delegates: DelegateItem[]
  isLoading: boolean
  selectedTags?: string[]
  isDelegateSelected: (selectors: string[], tags: string[]) => boolean
}

export interface DelegateItem {
  groupId: string
  groupName: string
  activelyConnected: boolean
  lastHeartBeat: number
  groupCustomSelectors: string[]
  groupImplicitSelectors: string[]
}
