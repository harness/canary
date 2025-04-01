import { PaginationProps } from '@components/index'
import { TranslationStore } from '@views/repo'
import { ExecutionState } from '@views/repo/pull-request'

interface RoutingProps {
  toConnectorDetails: (connector: ConnectorListItem) => string
}

export interface ConnectorListItem {
  identifier: string
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
}

export interface ConnectorListPageProps
  extends ConnectorListProps,
    Pick<PaginationProps, 'totalPages' | 'currentPage' | 'goToPage'> {
  searchQuery?: string
  setSearchQuery: (query?: string) => void
  isError?: boolean
  errorMessage?: string
}
