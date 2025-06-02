import { PipelineExecutionStatus, TLinkComponent } from '@/views'
import { MeterState } from '@components/meter'

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
  setPipelinesData: (
    data: IPipeline[] | null,
    { totalItems, pageSize }: { totalItems: number; pageSize: number }
  ) => void
  totalItems: number
  pageSize: number
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
  isLoading: boolean
  handleCreatePipeline: () => void
}
