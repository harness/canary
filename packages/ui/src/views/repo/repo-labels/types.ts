import { ILabelsStore } from '@views/project'

import { TranslationStore } from '../repo-list/types'

export interface RepoLabelPageProps {
  useTranslationStore: () => TranslationStore
  useLabelsStore: () => ILabelsStore
  createdIn?: string
  handleEditLabel: (identifier: string) => void
  openCreateLabelDialog: () => void
  handleDeleteLabel: (identifier: string) => void
  showSpacer?: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  isLoadingSpaceLabels: boolean
}
