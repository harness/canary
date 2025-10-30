import { Scope } from '@/views/common/types'
import { SecretListFilters } from '@components/filters'
import { PaginationProps } from '@components/index'

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
  type?: string
  tags?: {
    [key: string]: string
  }
}

export interface SecretListProps extends Partial<RoutingProps> {
  secrets: SecretListItem[]
  isLoading: boolean
  onEditSecret: (secret: SecretListItem) => void
  onDeleteSecret: (secretId: string) => void
  handleResetFiltersQueryAndPages?: () => void
  isDirtyList?: boolean
  paginationProps?: PaginationProps
}

export interface SecretListPageProps extends SecretListProps {
  searchQuery?: string
  setSearchQuery: (query?: string) => void
  setSecretManagerSearchQuery: (query?: string) => void
  // Will be updated from connectors list after migration to platform UI
  secretManagerIdentifiers: {
    identifier: string
    name?: string
  }[]
  isSecretManagerIdentifierLoading: boolean
  isError?: boolean
  errorMessage?: string
  onCreate: () => void
  currentPage: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
  setPageSize?: (size: number) => void
  onFilterChange?: (filters: SecretListFilters) => void
  onSortChange?: (sort: string) => void
  scope: Scope
  routes?: {
    toSettings?: (params: {
      accountId: string
      orgIdentifier?: string
      projectIdentifier?: string
      module?: string
    }) => string
  }
}
