import { MeterState } from '@components/meter'
import { TranslationStore } from '@views/repo'
import { TLinkComponent } from '@views/types/link-types'

import { PipelineExecutionStatus } from '../common/execution-types'

export interface IPipeline {
  id: string
  status?: PipelineExecutionStatus
  name?: string
  sha?: string
  description?: string
  version?: string
  timestamp?: number
  meter: {
    id: string
    state: MeterState
  }[]
}

export interface IPipelineListStore {
  pipelines: IPipeline[] | null
  setPipelinesData: (data: IPipeline[] | null, totalPages: number) => void
  totalPages: number
  page: number
  setPage: (page: number) => void
}

interface RoutingProps {
  toPipelineDetails: (pipeline: IPipeline) => string
}

/**
 * RoutingProps made optional for usage in apps/design-system
 */
export interface IPipelineListPageProps extends Partial<RoutingProps> {
  usePipelineListStore: () => IPipelineListStore
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  handleCreatePipeline: () => void
  LinkComponent: TLinkComponent
}

/**
 * RoutingProps made optional for usage in apps/design-system
 */
export interface IPipelineListProps extends Partial<RoutingProps> {
  pipelines: IPipeline[] | null
  LinkComponent: TLinkComponent
  query?: string
  handleResetQuery: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  handleCreatePipeline: () => void
}
