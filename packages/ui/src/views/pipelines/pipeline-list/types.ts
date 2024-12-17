import { MeterState } from '@components/meter'
import { TranslationStore } from '@views/repo'

import { PipelineExecutionStatus } from '../common/execution-types'

export interface Pipeline {
  id: string
  status?: PipelineExecutionStatus
  name?: string
  sha?: string
  description?: string
  version?: string
  timestamp?: string
  meter?: {
    id?: string
    state: MeterState
  }[]
}

export interface PipelineListStore {
  pipelines: Pipeline[] | null
  setPipelinesData: (data: Pipeline[] | null, totalPages: number) => void
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export interface PipelineListPageProps {
  usePipelineListStore: () => PipelineListStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

export interface PipelineListProps {
  pipelines: Pipeline[] | null
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  query?: string
  handleResetQuery: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
}
