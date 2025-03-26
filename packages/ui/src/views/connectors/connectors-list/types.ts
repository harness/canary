import { TranslationStore } from '@views/repo'

import { ConnectorItem } from '../types'

interface RoutingProps {
  toConnectorDetails: (connector: ConnectorItem) => string
}

export interface ConnectorListProps extends Partial<RoutingProps> {
  connectors: ConnectorItem[]
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  onEditConnector: (connector: ConnectorItem) => void
}

export interface ConnectorListPageProps extends ConnectorListProps {
  isError?: boolean
  errorMessage?: string
}
