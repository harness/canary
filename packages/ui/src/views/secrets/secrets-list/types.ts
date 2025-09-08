import { SecretListFilters } from '@components/filters'
import { ConnectorListItem } from '@views/connectors/connectors-list'

interface RoutingProps {
  toSecretDetails: (secret: SecretListItem) => string
}

export interface SecretListItem {
  identifier: string
  name?: string
  spec?: {
    secretManagerIdentifier?: string
    valueType?: string
    value?: string
    additionalMetadata?: string
  }
  createdAt?: number
  updatedAt?: number
  description?: string
  tags?: {
    [key: string]: string
  }
}

export interface SecretListProps extends Partial<RoutingProps> {
  secrets: SecretListItem[]
  isLoading: boolean
  onEditSecret: (secret: SecretListItem) => void
  onDeleteSecret: (secretId: string) => void
}

export interface SecretListPageProps extends SecretListProps {
  searchQuery?: string
  setSearchQuery: (query?: string) => void
  setSecretManagerSearchQuery: (query?: string) => void
  secretManagerIdentifiers: Pick<ConnectorListItem, 'identifier' | 'name'>[]
  isSecretManagerIdentifierLoading: boolean
  isError?: boolean
  errorMessage?: string
  onCreate: () => void
  currentPage: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
  onFilterChange?: (filters: SecretListFilters) => void
  onSortChange?: (sort: string) => void
}
