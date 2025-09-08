import { CheckboxOptions } from '@components/filters/types'
import { MultiSelectOption } from '@components/multi-select'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorConfigType } from '../types'

interface RoutingProps {
  toConnectorDetails: (connector: ConnectorListItem) => string
}

export interface ConnectorListItem {
  identifier: string
  type?: ConnectorConfigType
  name?: string
  description?: string
  status?: {
    status: ExecutionState
    errorSummary?: string
    errors?: {
      reason: string
      message: string
      code: number
    }[]
  }
  createdAt?: number
  lastModifiedAt?: number
  lastTestedAt?: number
  spec?: {
    url?: string
  }
  gitDetails?: {
    repoIdentifier?: string
    branch?: string
    objectId?: string
  }
  isFavorite?: boolean
}

export interface ConnectorListProps extends Partial<RoutingProps> {
  connectors: ConnectorListItem[]
  isLoading: boolean
  onEditConnector: (connector: ConnectorListItem) => void
  onTestConnection: (connector: ConnectorListItem) => void
  onDeleteConnector: (connectorId: string) => void
  onToggleFavoriteConnector: (connectorId: string, isFavorite: boolean) => void
}

export type ConnectorListFilters = {
  type?: CheckboxOptions[]
  status?: CheckboxOptions[]
  text?: string
  favorite?: boolean
  tags?: MultiSelectOption[]
  connectorIdentifier?: string
  description?: string
}

export interface ConnectorStats {
  typeStats: Array<{ type: ConnectorConfigType; count: number }>
}

export interface ConnectorListPageProps extends ConnectorListProps {
  searchQuery?: string
  setSearchQuery: (query?: string) => void
  isError?: boolean
  errorMessage?: string
  currentPage: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
  onFilterChange?: (filterValues: ConnectorListFilters) => void
  onSortChange?: (sort: string) => void
  onCreate: () => void
  connectorStats?: ConnectorStats
}
