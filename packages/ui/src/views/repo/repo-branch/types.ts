import { TranslationStore } from '@/views'

import { IBranchSelectorStore } from '../repo.types'

export interface BranchProps {
  id: number
  name: string
  sha: string
  timestamp: string
  user: {
    name: string
    avatarUrl?: string
  }
  checks?: {
    done?: number
    total?: number
    status?: number
  }
  behindAhead: {
    behind?: number
    ahead?: number
    default?: boolean
  }
}

export interface BranchListPageProps {
  branches: BranchProps[]
  spaceId?: string
  repoId?: string
  defaultBranch?: string
  useTranslationStore: () => TranslationStore
}

export interface MoreActionsTooltipProps {
  spaceId?: string
  repoId?: string
  defaultBranch?: string
  branchInfo: BranchProps
  useTranslationStore: () => TranslationStore
}

export interface RepoBranchListViewProps {
  isLoading: boolean
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  query?: string
}
