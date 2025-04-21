import { TranslationStore } from '@/views'

export interface DelegateConnectivityListProps {
  delegates: DelegateItem[]
  useTranslationStore: () => TranslationStore
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
