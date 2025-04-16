import { TranslationStore } from '@/views'

export interface DelegateConnectivityListProps {
  delegates: DelegateItem[]
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  selectedTags?: string[]
}

export interface DelegateItem {
  groupId: string
  groupName: string
  activelyConnected: boolean
  lastHeartBeat: number
  groupCustomSelectors: string[]
}

export interface DelegateSelectorItem {
  tags: string[]
}
