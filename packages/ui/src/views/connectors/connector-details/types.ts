import { TranslationStore } from '@/views'
import { LogoNameMap } from '@components/logo'
import { ExecutionState } from '@views/repo/pull-request'

import { InputFactory } from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorConfigType, onSubmitConnectorProps } from '../types'

export interface ConnectorReferenceListProps {
  entities: any
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  toEntity: (entity: any) => void
  toScope: (scope: any) => void
}

export interface ConnectorDetailsReferenceListProps {}

export interface ConnectorDetailsItem {
  identifier: string
  type: ConnectorConfigType
  name?: string
  description?: string
  status?: ExecutionState
  lastModifiedAt?: number
  lastTestedAt?: number
  spec: {
    url?: string
  }
  gitDetails?: {
    repoIdentifier?: string
    branch?: string
    objectId?: string
  }
  icon: keyof typeof LogoNameMap
  createdAt: number
  lastConnectedAt: number
}

export interface ConnectorDetailsPageProps {
  connectorDetails: ConnectorDetailsItem
  onTest: (connectorId: string) => void
  onDelete: (connectorId: string) => void
  useTranslationStore: () => TranslationStore
  onSave: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  inputComponentFactory: InputFactory
  apiError?: string
  isConnectorReferencesLoading: boolean
  setIsConnectorRefSearchQuery: (query?: string) => void
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  entities: any
  toEntity: (entity: any) => void
  toScope: (scope: any) => void
  searchQuery: string
  apiConnectorRefError?: string
}

export interface ConnectorDetailsReferencePageProps {
  searchQuery: string
  setSearchQuery: (query?: string) => void
  apiConnectorRefError?: string
  useTranslationStore: () => TranslationStore
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  isLoading: boolean
  entities: any[]
  toEntity: (entity: any) => void
  toScope: (scope: any) => void
}

export interface ConnectorDetailsHeaderProps {
  connectorDetails: ConnectorDetailsItem
  onTest: (connectorId: string) => void
  onDelete: (connectorId: string) => void
  useTranslationStore: () => TranslationStore
}

export enum ConnectorDetailsTabsKeys {
  CONFIGURATION = 'Configuration',
  REFERENCES = 'References',
  ACTIVITY = 'ActivityHistory'
}

export interface ConnectorDetailsConfigurationProps {
  connectorDetails: ConnectorDetailsItem
  useTranslationStore: () => TranslationStore
  onSave: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  inputComponentFactory: InputFactory
  apiError?: string
}
