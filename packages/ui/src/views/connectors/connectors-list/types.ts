import { CheckboxOptions } from '@components/filters/types'
import { PaginationProps } from '@components/index'
import { TranslationStore } from '@views/repo'
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
  status?: ExecutionState
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
}

export interface ConnectorListProps extends Partial<RoutingProps> {
  connectors: ConnectorListItem[]
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  onEditConnector: (connector: ConnectorListItem) => void
  onTestConnection: (connector: ConnectorListItem) => void
  onDeleteConnector: (connectorId: string) => void
}

export type ConnectorListFilters = {
  status?: CheckboxOptions[]
  text?: string
}

export interface ConnectorListPageProps
  extends ConnectorListProps,
    Pick<PaginationProps, 'totalPages' | 'currentPage' | 'goToPage'> {
  searchQuery?: string
  setSearchQuery: (query?: string) => void
  isError?: boolean
  errorMessage?: string
  onFilterChange?: (filterValues: ConnectorListFilters) => void
}
