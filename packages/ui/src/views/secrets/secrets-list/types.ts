import { PaginationProps } from '@components/index'
import { TranslationStore } from '@views/repo'

interface RoutingProps {
  toSecretDetails: (secret: SecretListItem) => string
}

export interface SecretListItem {
  identifier: string
  name?: string
  spec?: {
    secretManagerIdentifier?: string
  }
  createdAt?: number
  updatedAt?: number
}

export interface SecretListProps extends Partial<RoutingProps> {
  secrets: SecretListItem[]
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  onEditSecret: (secret: SecretListItem) => void
  onDeleteSecret: (secretId: string) => void
}

export interface SecretListPageProps
  extends SecretListProps,
    Pick<PaginationProps, 'totalPages' | 'currentPage' | 'goToPage'> {
  searchQuery?: string
  setSearchQuery: (query?: string) => void
  isError?: boolean
  errorMessage?: string
}
